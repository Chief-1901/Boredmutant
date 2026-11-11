---
title: Email order processing: why distributors still retype POs, and how to stop
seo_title: Email order processing for distributors: from emailed PO to sales order (2026)
description: Why distributors still retype emailed POs, the four ways to automate email order processing, how an email becomes an ERP sales order, and what retyping costs.
date: 2026-11-11
updated: 2026-11-11
keywords: email order processing, email to sales order, po email automation, email order entry automation, emailed purchase orders
answer: Distributors still retype emailed POs because most customers order by email and each one sends a different format, which EDI, web stores and template tools cannot absorb. To stop, put every order into one inbox, have software read each email and attachment, match the customer and items to your ERP records, and create the sales order for a person to approve, with unclear lines flagged as questions instead of guesses.
---

Ask a customer service lead at a mid-size distributor what their team does all morning and the answer is usually some version of "the inbox." Orders arrive as PDFs, spreadsheets, phone photos and three-line emails, and someone types each one into the ERP. This guide explains why that work has survived every wave of technology, the realistic ways to automate it, and how to work out whether it is worth doing for your business.

If you want the broader picture of AI order entry first, start with our guide to [AI order entry for distributors](/blog/ai-order-entry-for-distributors).

## Why do distributors still retype emailed POs?

Because email is how trade customers like to order, and it has not gone away.

In research with more than 3,500 customers of distributors, Distribution Strategy Group found that about 74% of end users order by email very frequently or frequently. Younger buyers leaned on it most: about 71% of buyers under 25 sent orders by email very frequently, against 37% of those over 55. That study is from 2016, but the direction since has been more channels, not fewer. A 2025 survey of 345 industrial buyers and contractors by Channel Marketing Group and BigCommerce found that 65% had made at least one online purchase that year, up from 45% in 2018. Customers are adding web ordering on top of email, not trading one for the other.

Three things keep the emailed PO alive:

- **The customer's own system produces it.** Many contractors and plants raise POs in their purchasing or ERP software, which prints a PDF and emails it. They are not going to log into your portal to retype what their system already produced.
- **EDI does not reach the long tail.** EDI works well for large trading partners who already run it. Most small and mid-size accounts never will.
- **Email is flexible.** A buyer can add "ship the elbows first" or "same as last Tuesday" in a sentence. No form captures that.

So the problem is not that customers send email. It is that every email has to be read, interpreted and keyed by a person.

## What makes an emailed PO hard to enter?

Reading the document is only part of the job. The slow part is turning the customer's words into your records.

| What arrives | Why it takes time |
|---|---|
| PDF from the customer's purchasing system | Layout differs by customer and changes when they upgrade their software |
| Spreadsheet | Columns are named and ordered differently by every customer |
| Free text in the email body | No structure at all; quantities and items are mixed with notes |
| Scan or phone photo | Has to be read as an image, often skewed or handwritten |
| Customer part numbers | Have to be translated to your item numbers |
| Units like "box", "case", "bundle" | Mean different quantities for different customers and items |
| Changes and follow-ups | "Please add 2 more to PO 4471" has to find and change an existing order |

Every row on that table is a judgment call a good rep makes many times a day. An email order processing system is only useful if it makes the same calls, or asks when it can't.

## What are your options for email order processing?

There are four broad approaches. They are not mutually exclusive; many distributors combine them.

| Approach | How it works | Good fit | Watch for |
|---|---|---|---|
| Email parsers and workflow tools | Rules extract fields from emails and send them on to other apps (Mailparser, for example, builds parsing rules with a setup wizard and passes data on through Zapier or webhooks) | A few customers with consistent emails | Rules need upkeep as formats change; matching to your items is up to you |
| Agents built into the ERP | The ERP vendor's own assistant watches a mailbox and drafts quotes or orders | You run that ERP and your orders are fairly simple | Check what it reads, what it can create, and its known limits |
| Order automation platforms | A subscription service that reads orders, matches them and posts them to your ERP | High volume and a mainstream ERP with a ready connector | Pricing usually grows with volume; you rent it |
| Built and owned | A pipeline built around your inbox, your customers and your ERP | Unusual formats, units or a customized ERP, or you want to own it | Needs a build period and a parallel run |

A few specifics, so you can compare like with like:

- **Microsoft Dynamics 365 Business Central** has a Sales Order Agent that monitors a mailbox, verifies the customer, checks item availability, creates a sales quote and drafts a reply with the quote attached as a PDF. Microsoft's documentation lists the points where a person reviews the work, and is open about limits: for example, items with non-base units of measure can come out with the wrong quantity.
- **Dynamics 365 Finance & Supply Chain Management** has a sales order agent that, according to Microsoft partner Sikich, monitors a mailbox for PDF and image attachments, extracts the purchase order details and creates the sales order.
- **Conexiom** is one of the longer-standing platforms. It reports that its customers process more than 80% of transactions without manual touches; treat that as a vendor figure and test it on your own orders.

None of these is wrong. The question is which one copes with your customers' actual emails, which is why the test at the end of this guide matters more than any feature list.

## How does an email become a sales order?

Whatever you buy or build, the work breaks into the same steps. Use this as a checklist when you talk to vendors.

1. **Capture.** Every order goes to one monitored inbox (orders@ or similar), with reps forwarding anything that lands in a personal inbox. Modern systems get new mail through push notifications: Microsoft Graph sends change notifications for messages in a mailbox, and the Gmail API's watch method publishes mailbox changes to Google Cloud Pub/Sub.
2. **Sort.** Not every email is an order. The system separates new orders from changes, cancellations, quote requests and "where is my order" questions, and routes each one.
3. **Read.** It pulls the header (customer, PO number, ship-to, dates, notes) and every line (item, quantity, unit, price) from the body and every attachment.
4. **Match.** It finds the customer and ship-to account, then translates each line to your item number using cross-references, order history and descriptions. Your ERP's own tools matter here. NetSuite, for example, has a Customer Part Numbers feature for importing sales orders by the customer's part numbers, and its documentation notes that an invalid or unknown part number makes the import for that transaction fail. Catching those before they reach the ERP is part of the job.
5. **Check.** It compares prices, units, minimums and availability against what your team checks today, and flags differences rather than quietly changing them.
6. **Review.** A person approves the order, or answers the specific question the system raised ("Line 3: customer part 4471-B matches two items"). Early on, every order is reviewed. Later, clean orders from trusted customers can go straight in.
7. **Write to the ERP.** The order goes in through whatever route the ERP supports. For Epicor Prophet 21, integration firm Airdev describes three native routes: scheduled flat-file import, EDI 850s and the separately licensed Transaction API. Airdev also notes that P21 has no native path for customer PDFs or emailed orders, which is exactly the gap this step fills.
8. **Confirm.** The customer gets an acknowledgment, and the email thread is linked to the order so anyone can see what was asked for.

## Running an old inbox script? Check it now

Some distributors already have a homegrown script or an older tool that reads the orders mailbox through Exchange Web Services (EWS). If your mail is in Microsoft 365, that script is on a deadline. Microsoft began disabling EWS in Exchange Online by default on October 1, 2026, and says that after April 1, 2027, EWS access will be permanently removed with no way to turn it back on. Until then, tenants can keep EWS running only for an approved list of apps.

The replacement is Microsoft Graph, and Microsoft's own migration guidance notes that it works differently: notifications arrive by webhook, and some EWS features have no direct equivalent, so tools may need redesigning rather than a quick patch. Ask whoever maintains your order inbox tooling which API it uses.

## What does it cost to keep retyping?

Two numbers matter: time and errors.

**Time.** Use this formula with your own figures:

**Yearly hours = orders per day × minutes per order × working days ÷ 60**

Say your team enters 80 emailed orders a day at 8 minutes each, 250 working days a year. That is 2,667 hours a year, more than one full-time person spent only on typing. At $32 an hour fully loaded, it is about $85,000 a year. The calculator on our [home page](/#cost) runs this with your numbers.

**Errors.** Manual keying is accurate most of the time, but not all of the time. Conexiom's review of the research describes about 1% as the figure most often cited as the ceiling for acceptable manual data entry. Measured rates can be higher: a 2019 study in the Journal of the American Medical Informatics Association found a 3.7% error rate when clinic staff typed test results into records by hand.

Here is what 1% looks like for the same distributor, as an illustration. If the average order has 6 lines, 80 orders a day is 480 keyed lines. At 1%, that is about 5 wrong lines a day, or about 1,200 a year. Some are caught before shipping. The rest become wrong deliveries, credit memos, return freight and an awkward call with a customer.

To get your real numbers, time ten ordinary orders from opening the email to saving the order, and count last quarter's credit memos caused by entry mistakes.

## How to get started this month

You can do the groundwork before choosing any tool:

1. **Consolidate.** Route all orders to one shared inbox and ask reps to forward stragglers.
2. **Sample.** Save one week of orders and tag each one: clean PDF, spreadsheet, free text, scan, customer part numbers, odd units.
3. **Measure.** Time ten orders and note the slowest steps. It is usually matching items, not typing.
4. **Clean the cross-references.** List your top 20 customers' part numbers and units against your items. Every approach above relies on this data.
5. **Test before you sign.** Give any vendor, including us, ten real orders including your worst one, and count three things: orders that would have gone in untouched, orders flagged with the right question, and orders that went in wrong without a flag. The last number is the one that matters.

## Frequently asked questions

### What is email order processing?

Email order processing is the work of turning purchase orders that customers email (in the message body or as PDF, spreadsheet or image attachments) into sales orders in your ERP. Automated email order processing uses software to read each email, match the customer and items to your records and create the order for a person to approve.

### Can email orders be entered into the ERP automatically?

Yes. Software can read emailed POs, match them to your customers and items and create the sales order through the ERP's API, import files or another supported route. Most teams start with a person approving every order, then let clean orders from trusted customers go straight in once accuracy is proven on their own orders.

### Is an email parser enough?

An email parser works when a few customers send consistent emails. It extracts fields but usually does not match customer part numbers or units to your items, and its rules need updating when a customer changes format. For many customers and formats you need matching and exception handling, not just extraction.

### Do customers have to change how they send orders?

No. The point of automating email orders is that customers keep ordering the way they do today. The only change most distributors make is asking customers to send orders to one shared address.

### What happens when the software is not sure about a line?

A good system does not guess. It holds the order and asks a person a specific question, such as which of two items a customer part number means, and remembers the answer so the same question does not come up again.

### Our order inbox script uses EWS. Do we need to act?

If your mailbox is in Microsoft 365, yes. Microsoft started disabling EWS in Exchange Online by default on October 1, 2026, and plans to remove it permanently after April 1, 2027. Tools that read the inbox through EWS need to move to Microsoft Graph.

## Sources

- Distribution Strategy Group, [The electronic postman always rings much more than twice](https://archive.distributionstrategy.com/the-electronic-postman-always-rings-much-more-than-twice/) (customer ordering research, October 2016)
- Digital Commerce 360, [Industrial B2B buyers shift to ordering online](https://www.digitalcommerce360.com/2025/06/09/industrial-b2b-buyers-digital-shift-order-online/) (Channel Marketing Group and BigCommerce survey, June 2025)
- Microsoft Learn, [Process sales quotes and orders with Sales Order Agent](https://learn.microsoft.com/en-us/dynamics365/business-central/sales-order-agent-process) (Business Central)
- Sikich, [Dynamics 365 Sales Order Agent: automating sales order intake for manufacturers and distributors](https://www.sikich.com/insight/dynamics-365-sales-order-agent-automating-sales-order-intake-for-manufacturers-and-distributors/)
- Mailparser, [Automated order processing with email parsing](https://mailparser.io/blog/automated-order-processing/)
- Conexiom, [What's a good data entry error rate? Benchmarks and how to reduce yours](https://conexiom.com/blog/whats-a-good-data-entry-error-rate-benchmarks-how-to-reduce-yours)
- Mays and Mathias, [Measuring the rate of manual transcription error in outpatient point-of-care testing](https://pmc.ncbi.nlm.nih.gov/articles/PMC6351970), Journal of the American Medical Informatics Association, 2019
- Oracle NetSuite Help, [Import transactions with customer part numbers](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4576567327.html)
- Airdev, [Prophet 21 order import](https://www.airdev.co/erp/prophet-21/order-import)
- Microsoft Learn, [Microsoft Graph API change notifications](https://learn.microsoft.com/graph/api/resources/webhooks)
- Google for Developers, [Gmail API users.watch](https://developers.google.com/gmail/api/v1/reference/users/watch)
- Microsoft 365 message center, [MC1227454: Exchange Web Services retirement update](https://mc.merill.net/message/MC1227454) (February 2026)
- Secvalley, [EWS retirement in Exchange Online: what broke on 1 October and what stops on 1 April 2027](https://www.secvalley.com/insights/exchange-web-services-ews-retirement/) (October 2026)
- Microsoft 365 Developer Blog, [Migrating EWS notifications to Microsoft Graph](https://devblogs.microsoft.com/microsoft365dev/migrating-ews-notifications-to-microsoft-graph/) (June 2026)
