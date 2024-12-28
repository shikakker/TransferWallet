from wise_payment import WisePaymentProcessor

# Initialize payment processor
processor = WisePaymentProcessor()

# Example payment
try:
    payment_result = processor.process_payment({
        'amount': 1000,  # $10.00
        'currency': 'USD',
        'recipient_id': 'recipient@example.com',
        'reference': 'Invoice payment #123'
    })
    print(f'Payment processed successfully: {payment_result}')
    
except ValueError as e:
    print(f'Invalid payment data: {str(e)}')
    
except Exception as e:
    print(f'Payment processing failed: {str(e)}')