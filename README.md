# TransferWallet — Crypto + Fiat Payments Prototype

Fintech / wallet **engineering prototype** exploring a unified consumer interface for crypto wallets, fiat payments, transfers, and multi-provider payment flows.

The old README described a broad Revolut-like platform with Wise, PayPal, SBP, Ethereum, TRON, Stripe, low-fee conversion, MFA, databases, and production-grade security as if those systems were already integrated. The current repository contains several real implementation experiments—most notably TRON wallet logic and Stripe service code—but it is **not a complete regulated payment platform**.

## What is represented in the repository

- React / Vite payment UI
- TRON / TronWeb integration
- Browser wallet detection
- TRON account creation experiment
- TRX balance lookup
- Stripe client-side helper
- Stripe server-side service modules
- Payment-intent route concepts
- Stripe webhook-handling concepts
- Order / payment API modules
- Wallet / payment service abstractions
- Multi-step payment / transfer UI concepts

## Tech stack

- React 18
- TypeScript
- Vite 5
- TronWeb 5
- Stripe Node SDK 14
- Tailwind CSS
- Lucide React

## TRON wallet implementation

`src/services/tronWeb.ts` initializes TronWeb either from a browser wallet extension or from a configured public TRON node:

```text
window.tronWeb
      |
      +-- available -> use injected wallet
      |
      `-- unavailable -> create TronWeb(fullHost)
```

The service currently implements:

```text
createWallet()
getBalance(address)
```

### Important key-management issue

`createWallet()` calls:

```text
tronWeb.createAccount()
```

in browser-accessible application code.

That returns account credentials including private-key material to the client runtime.

Generating a wallet is not the same as safely managing one. A production consumer wallet needs an explicit key-custody model covering:

- secure key generation;
- encryption at rest;
- backup / recovery;
- seed phrase handling;
- device compromise;
- transaction signing;
- phishing protection;
- address verification;
- key export / import;
- account deletion / recovery semantics.

Do not persist raw private keys in LocalStorage or transmit them to an application backend without a deliberately designed custody model.

## Stripe implementation

The repository contains two different Stripe-oriented layers.

### Browser helper

`src/services/stripe.ts` expects Stripe.js to exist on `window.Stripe`, accepts a publishable key, and calls a relative backend route for payment-intent creation.

### Server-oriented modules

Under `src/services/stripe/`, the project contains Node-style Stripe code using:

```env
STRIPE_SECRET_KEY=...
```

and functions for:

```text
create payment intent
confirm payment
cancel payment
webhook verification / handling
```

`src/api/payment.ts` also defines Express router concepts for payment creation and webhook events.

## Critical runtime mismatch: Vite package vs Express API code

The root package is a Vite frontend and its dependencies do **not** include Express.

However, `src/api/payment.ts` imports:

```text
express
```

and defines an Express router.

There is also no root server start script that mounts these routers as a production backend.

Therefore the current Stripe server code is **backend architecture / implementation fragments**, not a runnable API merely because the files exist.

Before documenting Stripe payments as working end-to-end:

1. add a real server / serverless runtime;
2. add the required backend dependencies;
3. mount payment routes intentionally;
4. keep `STRIPE_SECRET_KEY` server-side only;
5. configure raw-body webhook parsing correctly;
6. test Stripe signature verification;
7. persist payment / order state durably;
8. implement idempotency and reconciliation.

## Route mismatch to verify

The browser helper calls:

```text
/api/create-payment-intent
```

while the Express router shown in `src/api/payment.ts` defines:

```text
/create-payment
```

Unless another route layer maps those names, the client and server fragments do not currently describe the same endpoint.

Align the API contract before expecting the payment flow to work.

## Payment success / failure handling is incomplete

The current webhook route calls placeholder handlers where successful and failed payments are only logged.

A real financial system needs server-authoritative state transitions such as:

```text
provider event
    |
    v
signature verification
    |
    v
idempotent payment update
    |
    +-- ledger / transaction record
    +-- order state
    +-- notification
    `-- reconciliation evidence
```

Console logging is not a financial ledger.

## Providers mentioned in the old README

The historical README referenced platforms such as:

- Revolut;
- Wise;
- PayPal;
- Russia's SBP;
- Ethereum;
- CoinGecko / CoinMarketCap;
- Stripe.

The current root package directly includes **Stripe** and **TronWeb**.

Do not claim active Wise, PayPal, SBP, Ethereum, or live FX integrations unless the corresponding code / credentials / backend paths are actually present and tested.

## Regulatory / compliance boundary

A service that stores money, executes transfers, converts currencies, or holds cryptocurrency can trigger substantial legal / compliance requirements depending on jurisdiction and operating model.

A real product may need, among other things:

- licensed payment / e-money partners;
- KYC / AML;
- sanctions screening;
- transaction monitoring;
- fraud prevention;
- PCI scope analysis;
- consumer disclosures;
- chargeback / dispute workflows;
- custody analysis;
- tax / reporting obligations;
- data-protection controls;
- audit trails.

This repository is a technical prototype and should not be presented as a licensed financial service.

## Security requirements

Before real-money testing:

- separate browser and server code;
- never expose Stripe secret keys client-side;
- establish a wallet key-custody model;
- authenticate users;
- authorize every payment / transfer operation;
- add server-side amount / currency validation;
- implement idempotency;
- verify provider webhooks;
- add audit history;
- protect against replay / duplicate requests;
- add rate limits;
- define secrets management;
- test failure / recovery behavior.

## Local development

### Frontend

```bash
git clone https://github.com/shikakker/TransferWallet.git
cd TransferWallet
npm install
npm run dev
```

Build / lint / preview:

```bash
npm run lint
npm run build
npm run preview
```

The root project currently launches the Vite frontend only. The server-oriented Stripe modules need their own configured runtime before they can be tested as an API.

## Current status

**Advanced fintech integration prototype with partial TRON and Stripe implementation.** TRON wallet / balance logic and meaningful Stripe service / webhook code are present, but the repository does not yet provide a coherent full-stack runtime, secure wallet custody, end-to-end payment state, or the broader banking integrations described by the old README.

## Product intent

TransferWallet explores the difficult product boundary between a simple “send money” UI and the many systems required behind it: wallet identity, payment providers, blockchain networks, conversion, payment state, and security. Its strongest portfolio value is the progression from broad fintech concept toward concrete Stripe / TRON integration experiments—not a claim that a Revolut-class financial platform is already implemented.

## License

See repository files for licensing information and review Stripe / TRON SDK and provider terms separately.