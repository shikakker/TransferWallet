import os
import json
import time
import logging
from typing import Dict, Optional
import requests
from dotenv import load_load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class WisePaymentProcessor:
    """Handles secure payment processing using the Wise API."""
    
    def __init__(self):
        # Load environment variables
        load_dotenv()
        self.api_key = os.getenv('WISE_API_KEY')
        self.api_url = 'https://api.wise.com/v3'
        
        if not self.api_key:
            raise ValueError('WISE_API_KEY environment variable is required')
        
        # Configure session with default headers and timeout
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        })
        self.session.timeout = 30  # 30 seconds timeout
        
        # Validate API credentials on initialization
        self._validate_credentials()
    
    def _validate_credentials(self) -> None:
        """Validates API credentials by making a test request."""
        try:
            response = self.session.get(f'{self.api_url}/profiles')
            response.raise_for_status()
            logger.info('API credentials validated successfully')
        except requests.exceptions.RequestException as e:
            logger.error(f'Failed to validate API credentials: {str(e)}')
            raise ValueError('Invalid API credentials')
    
    def _make_request(
        self, 
        method: str, 
        endpoint: str, 
        data: Optional[Dict] = None
    ) -> Dict:
        """Makes a request to the Wise API with error handling and rate limiting."""
        url = f'{self.api_url}/{endpoint}'
        
        try:
            response = self.session.request(method, url, json=data)
            
            # Handle rate limiting
            if response.status_code == 429:
                retry_after = int(response.headers.get('Retry-After', 60))
                logger.warning(f'Rate limit reached. Waiting {retry_after} seconds')
                time.sleep(retry_after)
                return self._make_request(method, endpoint, data)
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f'API request failed: {str(e)}')
            raise
    
    def process_payment(self, payment_data: Dict) -> Dict:
        """
        Process a payment using the Wise API.
        
        Args:
            payment_data: Dictionary containing payment details:
                - amount: Amount in smallest currency unit
                - currency: 3-letter currency code
                - recipient_id: Recipient's email or ID
                - reference: Payment description/reason
        
        Returns:
            Dictionary containing payment response details
        
        Raises:
            ValueError: If payment data is invalid
            requests.exceptions.RequestException: If API request fails
        """
        # Validate input parameters
        required_fields = ['amount', 'currency', 'recipient_id', 'reference']
        missing_fields = [f for f in required_fields if f not in payment_data]
        
        if missing_fields:
            raise ValueError(f'Missing required fields: {", ".join(missing_fields)}')
        
        if not isinstance(payment_data['amount'], int) or payment_data['amount'] <= 0:
            raise ValueError('Amount must be a positive integer in smallest currency unit')
        
        if not payment_data['currency'].isalpha() or len(payment_data['currency']) != 3:
            raise ValueError('Invalid currency code')
        
        # Sanitize input data
        sanitized_data = {
            'targetAmount': payment_data['amount'],
            'targetCurrency': payment_data['currency'].upper(),
            'recipientId': str(payment_data['recipient_id']),
            'reference': str(payment_data['reference'])[:250],  # Limit reference length
            'paymentMetadata': {
                'transferType': 'BALANCE_PAYOUT',
                'timestamp': int(time.time())
            }
        }
        
        try:
            # Create quote
            quote = self._make_request('POST', 'quotes', {
                'targetAmount': sanitized_data['targetAmount'],
                'targetCurrency': sanitized_data['targetCurrency']
            })
            
            # Create transfer
            transfer = self._make_request('POST', 'transfers', {
                'quoteId': quote['id'],
                'targetAccount': sanitized_data['recipientId'],
                'reference': sanitized_data['reference'],
                'metadata': sanitized_data['paymentMetadata']
            })
            
            # Fund transfer
            payment = self._make_request('POST', f'transfers/{transfer["id"]}/payments', {
                'type': 'BALANCE'
            })
            
            logger.info(f'Payment processed successfully: {payment["id"]}')
            
            return {
                'success': True,
                'payment_id': payment['id'],
                'quote_id': quote['id'],
                'transfer_id': transfer['id'],
                'status': payment['status'],
                'created_at': payment['created']
            }
            
        except requests.exceptions.RequestException as e:
            logger.error(f'Payment processing failed: {str(e)}')
            raise
    
    def get_payment_status(self, payment_id: str) -> Dict:
        """Get the current status of a payment."""
        return self._make_request('GET', f'payments/{payment_id}')