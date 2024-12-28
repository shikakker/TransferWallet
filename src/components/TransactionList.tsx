import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {tx.type === 'send' ? (
                <ArrowUpRight className="w-5 h-5 text-red-500" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-green-500" />
              )}
              <div>
                <p className="font-medium">
                  {tx.type === 'send' ? 'Sent' : 'Received'} {tx.amount} {tx.token}
                </p>
                <p className="text-sm text-gray-500 font-mono truncate w-32">
                  {tx.address}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-1">
                {tx.status === 'pending' ? (
                  <Clock className="w-4 h-4 text-yellow-500" />
                ) : null}
                <span className={`text-sm ${
                  tx.status === 'completed' ? 'text-green-600' :
                  tx.status === 'failed' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {tx.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {tx.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}