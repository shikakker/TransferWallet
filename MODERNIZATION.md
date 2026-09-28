# TransferWallet — Modernization Roadmap

The repository contains meaningful TRON and Stripe implementation experiments, but the current Vite package does not provide a complete runnable payment backend and must not be presented as a regulated payment platform.

## 10 tasks
1. Split browser UI and server payment code into explicit frontend/backend packages or deployment boundaries.
2. Remove browser-side wallet creation unless a deliberate non-custodial key-management design is implemented and reviewed.
3. Never persist raw TRON private keys in localStorage, analytics, logs or an application database.
4. Add network/environment configuration for TRON nodes and validate chain/network before displaying balances or transfers.
5. Mount Stripe payment-intent and webhook handlers in a real server runtime with required dependencies and environment validation.
6. Verify Stripe webhook signatures from the raw request body and make event handling idempotent.
7. Define a server-side order/payment state machine instead of treating UI completion as payment completion.
8. Add tests for TRON provider failure, balance conversion, Stripe intent lifecycle, webhook replay and payment-state transitions.
9. Add CI with frontend build, backend typecheck/tests and secret scanning.
10. Position the project as a fintech engineering prototype demonstrating payment/wallet integration experiments, not banking, custody or a production Revolut alternative.

## Portfolio value
Potentially strong Product Engineer case because real provider code exists; highest priority is turning the fragmented server concepts into a verifiable end-to-end architecture.