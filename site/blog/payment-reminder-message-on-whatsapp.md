---
title: Payment reminder messages on WhatsApp: templates, costs and how to send them from Tally
seo_title: Payment reminder message on WhatsApp: templates and Tally setup (2026)
description: Ready-to-use WhatsApp payment reminder messages for distributors, plus how to send them from the Business app, TallyPrime or the API, and what each costs.
date: 2026-11-13
updated: 2026-11-13
keywords: payment reminder message on whatsapp, whatsapp payment reminder, payment reminder message for customer, tally whatsapp payment reminder, outstanding payment reminder message, payment reminder message in hindi
answer: A good WhatsApp payment reminder names the bill number, bill date, amount and due date, gives one easy way to pay (a UPI link or bank details), and tells the customer what to do if they have already paid. For a handful of parties you can send it by hand from the WhatsApp Business app; for dozens or hundreds, send it as an approved utility template from TallyPrime or through the WhatsApp Business API, which costs ₹0.115 per delivered message plus GST in India from 1 October 2026.
market: india
---

Most distributors already chase payments on WhatsApp. The salesman forwards a ledger screenshot, the accountant types "Sir, payment pending" to fifty retailers on the last day of the month, and nobody is sure who was reminded and who was not. Below: reminder messages you can copy, three ways to send them, what each costs, and the Tally setup that keeps them accurate.

## What a payment reminder message should contain

A vague "payment pending" message makes the retailer call you to ask which bill. A reminder that gets paid has these parts:

1. **Who it is from.** Your firm name, not just a salesman's first name.
2. **The bill.** Bill number and bill date, exactly as they appear in Tally, so the customer's accountant can find it.
3. **The amount and due date.** The outstanding amount on that bill, not the whole ledger balance, unless you are sending a statement.
4. **One way to pay.** A UPI payment link or QR code, or your bank account details.
5. **An exit.** "If you have already paid, please ignore this message or reply with the UTR number."
6. **A person to contact.** A name and number for disputes, short supply or rate differences.

Keep the tone flat and polite.

## Payment reminder messages you can copy

These follow the usual sequence: a nudge before the due date, a reminder on the day, then firmer follow-ups. The items in double braces, like `{{1}}`, are the variables WhatsApp templates use. If you send by hand, replace them yourself.

### Before the due date (3 days before)

> Namaste {{1}}, this is a reminder from {{2}}. Bill no. {{3}} dated {{4}} for ₹{{5}} is due on {{6}}. You can pay here: {{7}}. If you have already paid, please ignore this message. Thank you.

### On the due date

> Dear {{1}}, bill no. {{3}} from {{2}} for ₹{{5}} is due today. Pay by UPI here: {{7}}, or reply to this message if you need the bill copy again.

### 7 days overdue

> Dear {{1}}, our records show ₹{{5}} pending against bill no. {{3}} dated {{4}}, which was due on {{6}}. Please arrange payment this week: {{7}}. If you have paid, kindly reply with the UTR number so we can update our books.

### 30 days overdue

> Dear {{1}}, ₹{{5}} against bill no. {{3}} has been outstanding for 30 days. Please clear it or let us know a payment date by replying here. For any issue with this bill, contact {{8}} on {{9}}.

### Hindi version (before the due date)

> नमस्ते {{1}} जी, {{2}} की ओर से याद दिला रहे हैं: बिल नंबर {{3}} (दिनांक {{4}}) का ₹{{5}} का भुगतान {{6}} तक देय है। भुगतान यहाँ करें: {{7}}। अगर भुगतान हो चुका है तो कृपया इस संदेश को अनदेखा करें। धन्यवाद।

If you send through the API, avoid two things. Do not add offers, new schemes or "order now" lines. Meta treats a template that mixes a reminder with promotion as a marketing template, which costs about seven and a half times as much (see below). And do not threaten legal action in a routine template; at that stage a person should be handling it.

## Three ways to send WhatsApp payment reminders

| | WhatsApp Business app | TallyPrime with WhatsApp | WhatsApp Business API with automation |
|---|---|---|---|
| How it sends | You type or paste each message, or use a broadcast list | You open the bill or outstanding report in Tally and share it | Software sends approved templates on a schedule, straight from your Tally data |
| Who receives | Anyone you message; broadcasts only reach people who saved your number, up to 256 per list | The party's WhatsApp number in the ledger | Any customer who has agreed to hear from you on WhatsApp |
| Bill details | Typed by hand | Pulled from Tally | Pulled from Tally |
| Stops when paid | Only if someone checks | Only if someone checks | Yes, if it reads receipts before sending |
| Handles replies | You read them on the phone | You read them in the WhatsApp account | Can log replies ("paid", "will pay Friday") against the party |
| Cost | Free | ₹1,300 a year activation pack plus message charges | Message charges plus the cost of the software |
| Good for | Under about 30 active parties | A small team that already lives in Tally | Hundreds of parties, several salesmen, or multiple branches |

### 1. The WhatsApp Business app

It costs nothing and needs no setup, but it does not scale. According to WhatsApp's own help page, a broadcast list holds at most 256 contacts, and only people who have saved your number in their phone receive the broadcast. Every bill number and amount is typed by hand, which is where wrong amounts come from.

### 2. TallyPrime's built-in WhatsApp sharing

TallyPrime added WhatsApp sharing in Release 4.0, rolled out in December 2023, working with Interakt for the WhatsApp Business account. Tally's help pages describe sharing an invoice or report with **Alt+M**, sending sales invoices with a payment link or QR code so the party can tap "Pay Now", and sending Bills Receivable reminder letters filtered by how overdue they are. Only templates Meta has approved show up inside Tally.

On cost, Tally's India price list shows an activation or renewal pack at ₹1,300 a year, which includes ₹100 of wallet balance, and a top-up pack at ₹675 for ₹500 of balance, both before GST. Message charges come out of that wallet.

The limit is that someone still has to open the report and send. Tally's help describes sending one document to several numbers, not a scheduled run across all overdue parties.

### 3. The WhatsApp Business API with an automation layer

Here software reads your outstanding bills from Tally each morning, sends the right approved template to each party, and records what happened. It is the only option that can check whether a receipt was entered before sending, so a retailer who paid yesterday is not chased today.

## What WhatsApp reminders cost in India

WhatsApp charges per delivered template message, and the price depends on the template's category. Payment reminders tied to a customer's own bill are **utility** messages. Offers and promotions are **marketing**.

| Message type | Rate in India from 1 October 2026 (before GST) |
|---|---|
| Utility template (payment reminder, invoice, order update) | ₹0.115 per delivered message |
| Marketing template (offers, schemes, new products) | ₹0.8631 per delivered message |
| Service message (your free-form reply when a customer writes to you) | First 1,000 per number per month free, then ₹0.115 |

These figures are from Meta's India rate card as reported by TelecomTalk, the Free Press Journal and IBTimes India. Until 30 September 2026, utility templates sent within 24 hours of the customer's last message were free; from 1 October that exception ended in India, so every reminder now carries the utility rate. GST at 18% is added on top, and your software provider may add its own markup.

A worked example: a distributor with 300 active parties sends an average of four reminders a month to each. That is 1,200 utility messages, or ₹138 a month before GST and about ₹163 after. The message cost is small; the real cost is the staff time spent sending reminders by hand.

## Get your Tally data right first

Automated reminders are only as good as the outstanding report behind them. Before you send anything at scale, check three things in Tally:

1. **Bill-wise details are on.** Under **F11 (Features)**, "Maintain balances bill-by-bill" must be set to Yes, and sales entries must carry a bill reference. Without it, Tally knows the party's total balance but not which bill is overdue.
2. **Credit periods are set on each party.** Tally can age bills by bill date or by due date. Reminders should run on due date, otherwise a party on 30-day terms gets chased on day one.
3. **Receipts are adjusted against bills.** Tally's own guide warns that receipts entered without a bill reference stay "On Account", so the bill still looks unpaid. This is the most common cause of reminders going to customers who have already paid.

Run the Bills Receivable report with ageing by due date (change the slabs with **F6**). If it looks wrong to your accountant, fix the data before you automate anything.

## A sensible rollout for automated reminders

1. **Pick the sequence.** Decide which reminders go out and when, and when a person takes over.
2. **Write and approve the templates.** Submit each message to Meta as a utility template, in every language you use.
3. **Collect WhatsApp consent.** Customers must have agreed to receive messages from you on WhatsApp, for example on your account opening form.
4. **Connect to Tally.** The software reads bills, due dates, receipts and WhatsApp numbers. It should only read, never post.
5. **Run it quietly for two weeks.** It prepares each day's reminders without sending, and your accountant checks the list for unadjusted receipts and wrong numbers.
6. **Switch on, a group at a time.** Start with one route or one salesman's parties, then widen.

This is the same approach we take with order automation: let the system prepare the work, have a person check it until the numbers hold up, then let it run. Our [AI order entry guide](/blog/ai-order-entry-for-distributors) explains the idea for emailed orders.

## A note on the MSME 45-day rule

Under Section 15 of the MSMED Act, a buyer must pay a micro or small supplier within the agreed period, and that period cannot exceed 45 days; without a written agreement it is 15 days. But ClearTax notes that traders, including wholesalers, are registered on Udyam only for priority sector lending, and dues owed to them are generally not covered by the tax rule built on it. If you are a trading distributor, check with your CA before quoting the rule in reminders.

## How BoredMutant fits

We build WhatsApp and Tally automation for Indian distributors: orders read from WhatsApp and email and posted to Tally, invoices sent, and payments chased with a reminder sequence like the one above. Fixed price, and you own the software. See [how it works for Indian distributors](/india).

## Frequently asked questions

### Can I send payment reminders on WhatsApp for free?

Yes, if you send them by hand from the WhatsApp Business app. Broadcast lists are limited to 256 contacts each and only reach people who have saved your number. Through the WhatsApp Business API or TallyPrime, each delivered reminder is a utility message, charged at ₹0.115 plus GST in India from 1 October 2026.

### Is a payment reminder a utility or a marketing message on WhatsApp?

A reminder about a specific customer's bill is a utility message. If you add an offer, a new scheme or a product promotion to the same template, Meta can treat it as marketing, which costs ₹0.8631 per message in India. Keep reminders strictly about the bill.

### Can Tally send WhatsApp payment reminders automatically?

TallyPrime has had WhatsApp sharing since Release 4.0, and current releases can share invoices (including ones with a payment link), reports and Bills Receivable reminder letters. Someone still triggers the send from Tally. For a scheduled run that checks receipts before sending and handles replies, you need software that reads Tally data and sends through the WhatsApp Business API.

### What should a payment reminder message include?

Your firm name, bill number and date, amount and due date, one way to pay such as a UPI link, what to do if already paid, and a contact for disputes.

### How often should I send payment reminders?

A common sequence is one reminder a few days before the due date, one on the due date, and follow-ups at about 7 and 30 days overdue. After that, a person should call. Sending daily reminders tends to annoy good customers without speeding up slow ones.

## Sources

- WhatsApp Help Center, [How to use broadcast lists](https://whatsapp.com/faq/iphone/23782313)
- Meta for Developers, [Pricing on the WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp/pricing)
- TelecomTalk, [WhatsApp Business price reveal](https://telecomtalk.info/whatsappbusiness-price-reveal-telegram-arattai-may-benefit/1012403/) (India rates from 1 October 2026)
- Free Press Journal, [How much does India have to pay for WhatsApp messages from October 1?](https://www.freepressjournal.in/tech/how-much-does-india-have-to-pay-for-whatsapp-messages-from-october-1)
- IBTimes India, [WhatsApp Business messages to become paid from October 1](https://www.ibtimes.co.in/whatsapp-business-messages-become-paid-october-1-india-prices-rules-what-changes-906727)
- Tally Solutions, [Share documents using WhatsApp for Business](https://help.tallysolutions.com/tally-prime/tallyprime-with-whatsapp/share-documents-using-whatsapp-for-business/)
- Tally Solutions, [TallyPrime with WhatsApp price list](https://help.tallysolutions.com/tallyprime-with-whatsapp-price-list/)
- Tally Solutions, [How to track receivables, ageing and send payment reminders in TallyPrime](https://tallysolutions.com/business-guides/how-to-track-receivables-aging-and-send-payment-reminders-in-tallyprime/)
- Interakt, [TallyPrime with WhatsApp](https://www.interakt.shop/blog/tally-prime-with-whatsapp/) (Release 4.0 date)
- DoubleTick, [Utility template guidelines](https://learn.doubletick.io/templates/understanding-whatsapp-message-template-categories/utility-template-guidelines)
- ClearTax, [Section 43B(h) of the Income Tax Act](https://cleartax.in/s/section-43bh-of-income-tax-act) (MSME payment rule and traders)
