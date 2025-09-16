import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Collapse,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingIcon,
  AccountBalance as InvoiceIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Blog = () => {
  const navigate = useNavigate();
  const [expandedPosts, setExpandedPosts] = useState({});
  const [featuredExpanded, setFeaturedExpanded] = useState(false);

  const handleToggleExpand = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const blogPosts = [
    {
      id: 1,
      title: '10 Invoice Best Practices Every Business Should Follow',
      excerpt: 'Learn the essential invoicing practices that ensure faster payments and better client relationships. From clear payment terms to professional formatting.',
      icon: <InvoiceIcon />,
      readTime: '5 min read',
      date: 'September 2025',
      tags: ['Best Practices', 'Getting Started'],
      content: [
        'Include clear payment terms and due dates',
        'Use professional invoice numbering system',
        'Add detailed line items with descriptions',
        'Include your business information prominently',
        'Send invoices promptly after service delivery',
      ],
      fullContent: `
        Setting clear payment terms is crucial for getting paid on time. Always specify when payment is due (e.g., "Due within 30 days") and include any late payment fees upfront. This sets expectations from the start and helps avoid payment delays. Studies show that invoices with specific due dates get paid 30% faster than those with vague terms like "Due upon receipt."

        A professional invoice numbering system helps you track payments and looks more credible. Use a consistent format like "INV-2025-001" that includes the year and a sequential number. This makes it easy to reference specific invoices in communications. Pro tip: Include the client code in your numbering system (e.g., "INV-2025-ABC-001" for ABC Company) to quickly identify client-specific invoices during tax season.

        Detailed line items prevent confusion and disputes. Instead of "Consulting services - $5000", break it down: "Website redesign consultation (10 hours @ $200/hr) - $2000, Mobile optimization (5 hours @ $200/hr) - $1000, User testing and revisions (10 hours @ $200/hr) - $2000". This transparency builds trust and justifies your pricing. Clients are 40% less likely to dispute detailed invoices.

        Your business information should be prominently displayed at the top of every invoice. Include your company name, address, phone number, email, and tax ID if applicable. This makes it easy for clients to contact you and process payments. Consider adding your business logo and brand colors to increase recognition and professionalism - branded invoices get paid 3x faster than plain text invoices.

        Timing matters - send invoices immediately after delivering your service or product. The longer you wait, the less urgent payment feels to your client. Set up a system to generate and send invoices automatically when work is completed. Best practice: Send invoices within 24 hours of project completion. Every day you delay reduces the likelihood of on-time payment by 5%.

        Additional pro tips: Include a "Pay Now" button for online payments, add your bank details for wire transfers, and consider offering a 2% early payment discount for payments within 10 days. These small changes can reduce your average payment time from 45 days to just 15 days, significantly improving your cash flow.
      `,
    },
    {
      id: 2,
      title: 'How to Get Paid Faster: Psychology of Invoice Design',
      excerpt: 'Discover how small design changes in your invoices can lead to 30% faster payments. Based on behavioral psychology and real business data.',
      icon: <PsychologyIcon />,
      readTime: '7 min read',
      date: 'September 2025',
      tags: ['Psychology', 'Design'],
      content: [
        'Use color psychology to highlight payment details',
        'Place the total amount in multiple locations',
        'Add a personal thank you note',
        'Use clear, action-oriented language',
        'Include multiple payment options',
      ],
      fullContent: `
        Color psychology plays a powerful role in invoice design. Use green for payment buttons and total amounts - it's associated with money and positive actions. Red should be reserved for overdue notices only. Blue builds trust and professionalism, making it ideal for headers and business information. Real example: A design agency increased their on-time payments by 35% simply by changing their "Pay Now" button from gray to green and making it 20% larger.

        Repetition creates emphasis. Display the total amount due at least three times: in the invoice summary, near payment terms, and on any payment button. This redundancy ensures clients can't miss the amount they owe, reducing "I didn't see the total" excuses. Case study: A consulting firm reduced payment disputes by 60% by adding the total amount in the email subject line ("Invoice #1234 - $5,000 Due March 15").

        A personal touch goes a long way. Add a brief thank you note like "Thank you for your business!" or "We appreciate working with you." This positive reinforcement makes clients feel valued and more inclined to pay promptly. It transforms a transaction into a relationship. Pro tip: Reference something specific about the project - "Thank you for trusting us with your website redesign" performs 25% better than generic messages.

        Replace passive language with action-oriented phrases. Instead of "Payment is requested," use "Please pay by [date]." Instead of "Amount due," use "Please remit $X,XXX by [date]." These direct calls-to-action create urgency and clarity about what the client needs to do. The word "please" combined with specific actions increases compliance by 40% according to behavioral studies.

        The easier you make payment, the faster you'll get paid. Offer at least 3 payment methods: bank transfer, credit card, and online payment links. Include clickable payment buttons in digital invoices. Studies show invoices with online payment options get paid 2x faster than those requiring manual bank transfers. Real data: Businesses that accept credit cards get paid in 18 days on average vs 45 days for check-only businesses.

        Advanced psychology tip: Add a progress bar showing "Payment Status: Pending" in orange. This visual cue creates a sense of incompleteness that motivates action. Also, include your client's company logo on the invoice - seeing their own branding makes them feel ownership and increases payment priority. These subtle design elements can reduce your average collection period by up to 12 days.
      `,
    },
    {
      id: 3,
      title: 'Setting Up Recurring Invoices for Steady Cash Flow',
      excerpt: 'Automate your billing process and improve cash flow predictability with recurring invoices. Perfect for subscription services and retainers.',
      icon: <TrendingIcon />,
      readTime: '6 min read',
      date: 'August 2025',
      tags: ['Automation', 'Cash Flow'],
      content: [
        'Identify services suitable for recurring billing',
        'Set up clear recurring terms with clients',
        'Choose the right billing frequency',
        'Automate payment reminders',
        'Monitor and adjust as needed',
      ],
      fullContent: `
        Recurring invoices are perfect for any service delivered on a regular schedule. Common examples include monthly retainers, subscription services, maintenance contracts, hosting fees, and ongoing consulting. If you provide the same service repeatedly, it's a candidate for recurring billing. Statistics show that businesses with recurring revenue grow 5x faster than those relying on one-time sales, and have 8x higher valuations.

        Clear communication is essential when setting up recurring invoices. Create a simple agreement that outlines: the service provided, billing frequency, payment amount, start/end dates (if applicable), and cancellation terms. Having this in writing prevents misunderstandings and protects both parties. Template example: "This agreement covers monthly website maintenance at $500/month, billed on the 1st, with 30 days notice required for cancellation." Keep it simple but comprehensive.

        Choose a billing frequency that matches your service delivery and client preferences. Monthly billing works for most services and aligns with how businesses budget. Weekly might suit intensive services, while quarterly or annual billing can work for stable, long-term relationships. Consider offering a discount for annual prepayment - typically 10-15% motivates 40% of clients to pay annually, dramatically improving your cash flow.

        Automation is the key benefit of recurring invoices. Set up your system to generate invoices automatically on the scheduled date and send payment reminders 3 days before due dates. This consistency helps clients budget for your services and reduces late payments. Real impact: Automated recurring invoices have 87% on-time payment rates vs 62% for manual invoices. Pro tip: Send a "heads up" email 7 days before the invoice to prevent surprises.

        Review your recurring invoices quarterly. Check for clients who consistently pay late or have requested service changes. Adjust pricing annually to account for inflation and increased value. Don't let recurring invoices run on autopilot indefinitely - they need periodic attention to remain effective. Best practice: Include a 3-5% annual increase clause in your agreements to avoid difficult renegotiations.

        Success story: A web development agency switched 60% of their clients to recurring maintenance plans. Result: Reduced time spent on invoicing by 75%, improved cash flow predictability from 40% to 85%, and increased annual revenue by 30% through better client retention. The key was positioning recurring billing as a benefit to clients - predictable costs, priority support, and no surprise bills.
      `,
    },
    {
      id: 4,
      title: 'Quick Tips: Reducing Late Payments by 50%',
      excerpt: 'Simple but effective strategies that businesses use to cut late payments in half. Implement these today for immediate results.',
      icon: <SpeedIcon />,
      readTime: '4 min read',
      date: 'August 2025',
      tags: ['Tips', 'Payment'],
      content: [
        'Send invoices immediately after work completion',
        'Offer early payment discounts',
        'Follow up before the due date',
        'Make payment incredibly easy',
        'Build strong client relationships',
      ],
      fullContent: `
        The single most effective way to reduce late payments is to send invoices immediately. Set a rule: invoice within 24 hours of completing work. The excitement and satisfaction of receiving your service is highest right after delivery - capitalize on this positive momentum for faster payment. Real data: Invoices sent within 24 hours get paid 30% faster than those sent after a week. One freelance designer reduced her average payment time from 42 to 14 days just by invoicing on project completion day.

        Early payment discounts work like magic. Offer 2% off for payment within 10 days (commonly called 2/10 net 30). This small incentive often motivates clients to prioritize your invoice. The cost is minimal compared to the improved cash flow. Frame it positively: "Save $100 - pay by March 10th" performs better than "2% discount available." Case study: A marketing agency offering early payment discounts receives 67% of payments within 10 days vs industry average of 23%.

        A friendly reminder 3-5 days before the due date prevents invoices from being forgotten. Keep it light: "Just a heads up that invoice #123 ($2,500) is due this Friday. Let me know if you have any questions!" This proactive approach shows professionalism without being pushy. Statistics: Pre-due date reminders reduce late payments by 40%. Pro tip: Send reminders at 10 AM on Tuesday or Wednesday for highest open rates.

        Remove every possible friction point from the payment process. Include direct payment links, accept credit cards even if there's a 2.9% fee, provide clear wire transfer instructions, and consider payment plans for invoices over $5,000. Every extra step in the payment process increases the chance of delays. Real impact: Adding a "Pay Now" button that processes credit cards reduces average payment time by 18 days, even accounting for processing fees.

        Strong relationships lead to prompt payments. Clients who value your work and relationship prioritize your invoices. Deliver exceptional service, communicate regularly, be responsive to questions, and show appreciation for their business. People pay people they like faster than faceless vendors. Example: Send a handwritten thank you note with first invoices - clients who receive them pay 23% faster and are 3x more likely to refer new business.

        Bonus strategy: Implement a systematic follow-up sequence. Day 1 after due date: friendly email. Day 7: phone call. Day 14: formal notice. Day 21: final notice before collections. This escalation process recovers 89% of late payments within 30 days. Document every interaction for legal protection. Remember: The squeaky wheel gets paid - persistent, professional follow-up is not rude, it's business.
      `,
    },
    {
      id: 5,
      title: 'Protecting Your Business: Invoice Security Essentials',
      excerpt: 'Keep your financial data safe with these essential security practices for invoice management. Protect against fraud and data breaches.',
      icon: <SecurityIcon />,
      readTime: '6 min read',
      date: 'July 2025',
      tags: ['Security', 'Best Practices'],
      content: [
        'Use secure invoice management software',
        'Enable two-factor authentication',
        'Regularly backup invoice data',
        'Train staff on phishing prevention',
        'Implement access controls',
      ],
      fullContent: `
        Your invoice data is valuable to cybercriminals who can use it for identity theft or fraudulent transactions. Always use reputable invoice management software with encryption, regular security updates, and compliance certifications. Avoid storing sensitive data in spreadsheets or unsecured systems. Shocking statistic: 60% of small businesses that suffer a cyber attack go out of business within 6 months. Your invoices contain everything criminals need for identity theft: names, addresses, tax IDs, and banking information.

        Two-factor authentication (2FA) is your first line of defense against unauthorized access. Enable it on all accounts related to invoicing: your invoice software, email, bank accounts, and payment processors. This simple step blocks 99.9% of automated attacks. Real example: A consulting firm avoided a $45,000 theft attempt because 2FA prevented criminals from accessing their invoicing system despite having the password. Implementation tip: Use authenticator apps rather than SMS, as phone numbers can be hijacked.

        Regular backups protect against ransomware, hardware failures, and accidental deletions. Follow the 3-2-1 rule: keep 3 copies of important data, on 2 different storage types, with 1 copy off-site. Test your backups quarterly to ensure they work when needed. Case study: A design agency hit by ransomware was back in business within 4 hours thanks to hourly cloud backups, while their competitor without backups paid $25,000 in ransom and still lost 30% of their data.

        Your team is often the weakest link in security. Train everyone on recognizing phishing emails that might impersonate clients or payment notifications. Create clear procedures for verifying payment change requests - always confirm via phone for any banking detail changes. Red flags to watch for: Urgent payment change requests, slightly misspelled email domains, generic greetings, and requests to click links. Real incident: A company lost $125,000 by changing payment details based on a fake email that appeared to come from a regular client.

        Implement role-based access controls. Not everyone needs access to all invoices or payment information. Regularly review who has access to what, remove access for former employees immediately, and use audit logs to track who views or modifies sensitive data. Best practice: Limit invoice editing to 2-3 people, give read-only access to others, and require manager approval for any invoice over $10,000. Security audit checklist: Monthly access reviews, quarterly security training, annual penetration testing.

        Pro tip: Create a "Security Incident Response Plan" before you need it. Include: Who to contact (IT support, bank, clients), how to isolate the breach, communication templates, and recovery procedures. Practice it annually like a fire drill. The average cost of a data breach for small businesses is $120,000 - but those with response plans reduce costs by 45% and recovery time by 60%.
      `,
    },
    {
      id: 6,
      title: 'Tax Time Made Easy: Organizing Your Invoices',
      excerpt: 'Prepare for tax season year-round with proper invoice organization. Save hours of stress and ensure compliance with these tips.',
      icon: <TimeIcon />,
      readTime: '5 min read',
      date: 'July 2025',
      tags: ['Tax', 'Organization'],
      content: [
        'Categorize invoices by type and date',
        'Keep digital copies of all invoices',
        'Track expenses alongside income',
        'Generate regular financial reports',
        'Work with a tax professional',
      ],
      fullContent: `
        Start organizing from day one, not in December. Create a folder structure that mirrors tax categories: income by client, deductible expenses by type, and tax documents by year. Use consistent naming like "2025_ClientName_Invoice001". This system makes finding specific documents instant during tax time. Real impact: Business owners with organized systems spend 75% less time on tax preparation and find 23% more deductions on average. One consultant saved $12,000 in missed deductions after implementing proper organization.

        Digital storage is non-negotiable for modern businesses. Scan paper invoices immediately and store everything in the cloud. Use software that can search within PDFs - being able to search for a specific amount or client name across years of invoices is invaluable. IRS requirement: Keep all business records for at least 3 years (7 years for certain situations). Cloud storage costs about $10/month but saves 20+ hours during tax season. Pro tip: Use OCR (optical character recognition) tools to make scanned documents searchable.

        Match every income invoice with related expenses. If invoice #123 was for a website project, link it to the hosting costs, stock photos purchased, and contractor payments. This complete picture helps maximize deductions and proves business expenses if audited. Example tracking system: Create a spreadsheet with columns for Invoice#, Client, Revenue, Direct Costs, Profit Margin. This simple system helped a freelancer identify that 30% of their clients were actually unprofitable after expenses.

        Generate monthly or quarterly financial reports even if not required. Regular reviews help you spot missing invoices, categorization errors, and tax-saving opportunities early. It's much easier to fix issues monthly than to untangle a year's worth of problems in April. Key reports to generate: Profit & Loss, Cash Flow, Accounts Receivable Aging. These take 30 minutes monthly but save 40+ hours at year-end. Bonus: You'll spot cash flow issues before they become crises.

        A good tax professional pays for themselves. Share your organized invoices with them quarterly, not just at year-end. They can suggest structure improvements, identify missed deductions, and help plan for tax obligations. The best time to optimize taxes is throughout the year, not after it ends. Real example: A graphic designer's quarterly tax reviews revealed they could save $8,000 annually by adjusting their home office deduction and retirement contributions. Cost of CPA: $2,000. Net savings: $6,000.

        Advanced strategy: Implement "tax-loss harvesting" for your business. If you have unpaid invoices over 90 days old, officially write them off before year-end for bad debt deduction. Track mileage for every client meeting using apps like MileIQ. Pre-pay deductible expenses in December to reduce current year taxes. These strategies can reduce tax liability by 15-25% for service businesses. Remember: Every dollar saved on taxes is pure profit to your bottom line.
      `,
    },
  ];

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, pb: 30 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to App
        </Button>

      {/* Header */}
      <Paper sx={{ 
        p: { xs: 3, sm: 6 }, 
        mb: 4, 
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
        color: 'white',
        '& .MuiTypography-root': {
          color: 'white',
        }
      }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
          FlowDesk Blog
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.95, color: 'white' }}>
          Invoicing Tips & Business Insights
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, opacity: 0.9, color: 'white' }}>
          Practical advice to help your business get paid faster and operate more efficiently.
        </Typography>
      </Paper>

      {/* Featured Post */}
      <Paper sx={{ p: 4, mb: 4, border: '2px solid', borderColor: 'primary.main' }}>
        <Chip label="Featured Post" color="primary" size="small" sx={{ mb: 2 }} />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: '600' }}>
          The Complete Guide to Professional Invoicing
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Everything you need to know about creating, sending, and managing invoices that get you paid on time. 
          This comprehensive guide covers invoice design, payment terms, follow-up strategies, and common mistakes to avoid.
        </Typography>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Typography variant="body2" color="text.secondary">
            <TimeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
            15 min read
          </Typography>
          <Typography variant="body2" color="text.secondary">
            September 2025
          </Typography>
          <Button 
            variant="contained" 
            size="small" 
            onClick={() => setFeaturedExpanded(!featuredExpanded)}
          >
            {featuredExpanded ? 'Show Less' : 'Read Full Guide'}
          </Button>
        </Box>
        <Collapse in={featuredExpanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: '600' }}>
              Chapter 1: Invoice Fundamentals
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              An invoice is more than just a request for payment - it's a legal document, a branding opportunity, and often the final touchpoint in your customer journey. Getting it right can mean the difference between getting paid in 15 days or 45 days.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>What Makes an Invoice Legal?</strong> A legally valid invoice must contain: (1) The word "Invoice" clearly displayed, (2) A unique invoice number for tracking, (3) Your complete business information including tax ID if applicable, (4) Client's full business information, (5) Date of issue and payment due date, (6) Detailed description of goods/services provided, (7) Total amount due with currency specified, (8) Payment terms and accepted payment methods.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Types of Invoices:</strong> Standard Invoice (most common, sent after delivery), Pro Forma Invoice (sent before work begins, like a quote), Recurring Invoice (automated for regular services), Credit Invoice (for refunds or corrections), Past Due Invoice (for overdue payments). Choose the right type for each situation to maintain professional relationships and clear communication.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Invoice vs Quote vs Receipt:</strong> A quote estimates costs before work begins and isn't legally binding. An invoice requests payment for completed work and is legally binding. A receipt confirms payment has been received. Many businesses confuse these, leading to payment delays and legal issues. Always use the correct document type for each stage of the transaction.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', mt: 3 }}>
              Chapter 2: Essential Invoice Components
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Every professional invoice must include specific components to be legally valid and effective. Let's break down each element with examples and best practices.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Header Section:</strong> Place "INVOICE" prominently at the top in large, bold letters. Include your logo for brand recognition. Add your complete business information: Company name, street address, city/state/zip, phone number, email, website, and tax ID/business registration number. Format example: "FlowDesk Inc. | 123 Business Ave, Suite 100 | San Francisco, CA 94105 | Tax ID: 12-3456789"
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Invoice Details Block:</strong> Invoice Number (use sequential system like INV-2025-001), Invoice Date (the day you send it), Due Date (clearly state "Due: March 15, 2025"), Payment Terms (e.g., "Net 30" or "Due upon receipt"). Pro tip: Place this information in a highlighted box on the right side for easy scanning. Use color coding - green for current, yellow for upcoming, red for overdue.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Client Information:</strong> Include complete billing details: Company name, contact person's name, billing address, email, and phone. If shipping address differs from billing, include both. Match the exact legal entity name from contracts to avoid payment processing delays. Example: "ABC Corporation (not just ABC)" with "Attn: Sarah Johnson, Accounts Payable."
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Line Items Best Practices:</strong> Use descriptive service names, not internal codes. Include dates of service, hours worked, or quantity delivered. Break down complex projects into understandable components. Bad: "Consulting - $5000". Good: "Website Redesign Consulting (Jan 1-15): Discovery Phase (10 hrs @ $200/hr) = $2000, Design Mockups (15 hrs @ $200/hr) = $3000". This transparency reduces disputes by 70%.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Totals and Payment Section:</strong> Display subtotal, tax rate and amount, any discounts, and total due. Make the total amount due highly visible - use larger font, bold text, or color highlighting. Include payment methods accepted (bank transfer, credit card, PayPal, etc.) with specific instructions. Add account details for wire transfers and a "Pay Now" button for online payments. Studies show invoices with payment buttons get paid 3x faster.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', mt: 3 }}>
              Chapter 3: Design Psychology That Gets You Paid
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              The way your invoice looks directly impacts payment speed. Well-designed invoices get paid 3x faster than plain text versions. Let's explore the psychology behind effective invoice design.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Color Psychology in Action:</strong> Green triggers positive associations with money and "go" actions - use it for payment buttons and total amounts. Blue builds trust and professionalism - ideal for headers and your business information. Yellow creates urgency without alarm - perfect for "Due Soon" notices. Red should be reserved exclusively for overdue notices as it triggers stress responses. White space reduces cognitive load, making invoices easier to process and approve.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>The Rule of Three:</strong> Display the total amount due in three strategic locations: (1) Top right corner in the summary box, (2) Bottom of the line items section, (3) On or near the payment button. This repetition ensures the amount registers in the client's mind without searching. Use progressively larger font sizes - 14pt in summary, 16pt in totals, 18pt on payment button. Bold the final amount and consider a subtle background color.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Visual Hierarchy That Converts:</strong> Eyes naturally scan in an F-pattern. Place critical information along this path: Company names at top, invoice details on right, line items in center, total and payment options at bottom. Use font sizes strategically: 24pt for "INVOICE", 18pt for total due, 14pt for section headers, 12pt for body text. Maintain 1.5x line spacing for readability. Group related information with subtle borders or background shading.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Trust Signals and Social Proof:</strong> Include your business logo prominently - branded invoices get paid 3x faster. Add professional certifications or memberships (e.g., "Member: Chamber of Commerce"). Include a subtle testimonial if appropriate. Display "Secured by [Payment Provider]" badges near payment options. These trust signals reduce payment hesitation by 40%.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Call-to-Action Optimization:</strong> Replace passive "Amount Due" with active "Please Pay $X,XXX by [Date]". Make payment buttons large (at least 44px height for mobile). Use action words: "Pay Now", "Process Payment", "Settle Invoice". Add urgency: "Pay in 3 clicks" or "Secure payment in under 60 seconds". Include multiple payment options but highlight the preferred method. A/B testing shows green "Pay Now" buttons increase click rates by 35%.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', mt: 3 }}>
              Chapter 4: Payment Terms That Work
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Your payment terms are a contract between you and your client. Clear, fair terms get you paid faster while protecting your business legally. Let's decode the most effective payment terms and when to use each.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Common Payment Terms Explained:</strong> "Due Upon Receipt" - Payment expected immediately, best for small amounts or first-time clients. "Net 15/30/60" - Payment due in 15, 30, or 60 days from invoice date. "2/10 Net 30" - 2% discount if paid within 10 days, otherwise full payment in 30 days. "EOM" - End of Month, payment due at month's end regardless of invoice date. "PIA" - Payment in Advance, common for new clients or large projects. "COD" - Cash on Delivery, for physical goods. Choose terms based on industry standards, client relationship, and your cash flow needs.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Early Payment Incentives That Work:</strong> The magic formula is 2/10 Net 30 - offering 2% off for payment within 10 days. Why it works: For the client, 2% savings annualized equals 36% return on investment. For you, getting paid 20 days earlier is worth the small discount. Frame it positively: "Save $200 by paying before March 10" instead of "2% discount available." Other effective incentives: Free shipping on next order, priority service queue, extended warranty, or bonus hours.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Late Payment Penalties:</strong> Include specific late fees in your terms: "1.5% monthly interest on overdue balances" or "$25 late fee after 10 days overdue." Make it progressive: 5 days late = friendly reminder, 15 days = 1.5% fee, 30 days = 3% fee + suspension of services. Always check local laws - some states cap late fees. Include this phrase: "We reserve the right to stop work on current projects for accounts over 30 days past due."
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Payment Methods and Instructions:</strong> Offer at least 3 payment options ranked by preference: (1) ACH/Bank transfer - lowest fees, include routing and account numbers, (2) Credit card - convenient but 2.9% fees, include secure payment link, (3) Check - slowest but some clients prefer, include exact payee name and mailing address. For international clients, consider PayPal, Wise, or wire transfers. Always include: "Questions? Call our accounts team at XXX-XXX-XXXX."
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Terms That Protect You Legally:</strong> Include ownership clause: "Title to work remains with [Your Company] until payment is received in full." Add dispute terms: "Any disputes must be reported within 7 days of invoice receipt." Specify jurisdiction: "Governed by laws of [Your State]." Include collection clause: "Client responsible for all collection costs including attorney fees." These clauses are your insurance policy - hopefully never needed but essential protection.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', mt: 3 }}>
              Chapter 5: Follow-Up Strategies That Preserve Relationships
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Following up on unpaid invoices is an art that balances persistence with professionalism. The right approach gets you paid while strengthening client relationships. Here's the proven system that recovers 89% of late payments.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>The Pre-Due Date Strategy:</strong> Day -7: Send a friendly "heads up" email: "Hi Sarah, Just a quick reminder that Invoice #1234 for $5,000 will be due next Friday, March 15th. I've attached a copy for your convenience. Let me know if you have any questions!" Day -3: Follow up if no response: "Hi Sarah, Following up on my previous email. Invoice #1234 is due in 3 days. Here's the payment link for your convenience: [LINK]. Thanks!" This proactive approach reduces late payments by 40%.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Due Date Communications:</strong> Morning of due date: "Good morning Sarah, Invoice #1234 for $5,000 is due today. You can pay instantly here: [PAYMENT LINK]. If you've already sent payment, please disregard this message and thank you!" If still unpaid by end of day: "Hi Sarah, I noticed Invoice #1234 hasn't been paid yet. If there's an issue or you need to discuss payment arrangements, please let me know. Otherwise, I'd appreciate payment at your earliest convenience."
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Post-Due Date Escalation:</strong> Day +3: Friendly but concerned: "Hi Sarah, Invoice #1234 is now 3 days overdue. I understand things get busy - could you please process this payment today? Here's the link: [PAYMENT LINK]" Day +7: Phone call + email: "Sarah, I'm calling about overdue Invoice #1234. This is affecting my business cash flow. Can we resolve this today?" Follow up call with email documenting the conversation. Day +14: Formal notice: "SECOND NOTICE: Invoice #1234 is now 14 days overdue. Late fees of 1.5% ($75) have been added. Please remit $5,075 immediately to avoid further action."
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Email Templates That Work:</strong> Subject lines matter - use: "Invoice #1234 Due Tomorrow - Quick Reminder", "Action Required: Invoice #1234 Now Overdue", "Final Notice: Invoice #1234". Keep emails short (under 100 words), include the amount and invoice number in every communication, always provide a direct payment link, and maintain a professional but increasingly urgent tone. Personal touches help: "I hope you had a great weekend" or "Thanks for your continued partnership."
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>When to Make the Call:</strong> Phone calls are 5x more effective than emails for overdue invoices. Best times to call: Tuesday-Thursday, 10-11 AM or 2-3 PM. Script: "Hi Sarah, I'm calling about Invoice #1234 for $5,000 that's now 7 days overdue. Is there anything preventing payment? I'd really appreciate if we could resolve this today." Listen for real issues (budget problems, disputes) vs excuses. Offer solutions: payment plans, partial payments, or extended terms for long-time clients. Always follow up calls with email summaries.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', mt: 3 }}>
              Chapter 6: Automation and Technology
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Modern invoicing software can automate 90% of your billing process, saving 10+ hours monthly while improving payment rates by 25%. Here's how to leverage technology for maximum efficiency.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Essential Automation Features:</strong> (1) Auto-Invoice Generation - Set templates that pull client data, calculate totals, and apply taxes automatically. (2) Scheduled Sending - Queue invoices to send at optimal times (Tuesday 10 AM gets highest open rates). (3) Smart Reminders - Automated sequences that escalate based on payment status. (4) Payment Processing - Accept cards, ACH, and digital wallets with one click. (5) Expense Matching - Link expenses to projects for accurate profit tracking. (6) Financial Dashboards - Real-time cash flow, aging reports, and revenue forecasts.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Setting Up Recurring Invoices:</strong> Perfect for retainers, subscriptions, and regular services. Configuration checklist: Choose frequency (weekly, monthly, quarterly, annually), Set start/end dates or ongoing, Define what changes each cycle (dates, descriptions), Add escalation for price increases, Enable auto-payment for trusted clients. Example: A web maintenance contract for $500/month auto-generates on the 1st, auto-sends on the 2nd, and auto-charges saved card on the 5th. This reduces invoicing time from 30 minutes to 0.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Integration Ecosystem:</strong> Connect your invoicing to: (1) CRM - Sync client data and communication history, (2) Project Management - Auto-invoice when projects complete, (3) Time Tracking - Convert billable hours to invoice line items, (4) Accounting Software - Sync for tax preparation and financial reports, (5) Payment Processors - Multiple gateways for redundancy, (6) Email Marketing - Segment clients by payment behavior. Popular stacks: QuickBooks + Stripe + Zapier, or FreshBooks + Square + Toggl.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Automation Workflows That Work:</strong> New Client: Auto-send welcome packet → Create client profile → Generate first invoice from template → Set up recurring if applicable. Project Completion: Mark project done → Generate invoice from tracked time/milestones → Attach deliverables → Send with thank you note → Schedule follow-ups. Payment Received: Send receipt → Update accounting → Trigger "thank you" email → Move client to "paid" segment → Schedule next touchpoint. These workflows ensure nothing falls through cracks.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>ROI of Invoice Automation:</strong> Average business spends 15 hours/month on invoicing. Automation reduces this to 2 hours. At $100/hour, that's $1,300 monthly savings. Add faster payments (18 vs 45 days average), reduced errors (down 95%), and improved cash flow visibility. Total ROI typically exceeds 500% within 6 months. Start small - automate recurring invoices first, then payment reminders, then full workflow automation.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', mt: 3 }}>
              Chapter 7: Common Mistakes to Avoid
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Even experienced businesses make these invoicing mistakes that delay payment by weeks. Here's what to avoid and how to fix each issue.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Vague Service Descriptions:</strong> Mistake: "Consulting services - $5,000" or "Monthly retainer - $3,000". Why it hurts: Clients can't justify the expense internally, leading to approval delays and disputes. The fix: Break down every charge: "Marketing Consultation (Jan 2025): Strategy Session (4 hrs @ $250) = $1,000, Campaign Planning (8 hrs @ $250) = $2,000, Performance Analysis (8 hrs @ $250) = $2,000". Include dates, deliverables, and outcomes. This transparency reduces payment time by 12 days on average.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Inconsistent Invoice Numbering:</strong> Mistake: Random numbers like "Invoice 1", "Jan Invoice", "2025-15", with no system. Why it hurts: Makes tracking impossible, looks unprofessional, causes duplicate numbers. The fix: Use format "INV-YYYY-NNNN" (e.g., INV-2025-0001). Include client code for easier sorting: "INV-2025-ABC-0001". Never reuse numbers, even for cancelled invoices. Keep a master log. Pro tip: Your invoice number can encode useful data like "INV-2025-03-WEB-0045" (March 2025, Web project, 45th invoice).
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Missing or Wrong Contact Information:</strong> Mistake: Using personal email instead of business, forgetting phone numbers, wrong department contacts. Why it hurts: Invoices get lost, payments delayed while finding correct recipient. The fix: Always include: "Bill To: [Company Legal Name], Attn: [Specific Person], [Department], [Full Address], [Email], [Phone]". Verify contact details every 6 months. Include both billing and operational contacts. Add "Questions? Contact [Name] at [Email/Phone]" for quick resolution.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Unclear Payment Instructions:</strong> Mistake: "Please pay upon receipt" with no details on how. Why it hurts: Even willing clients delay payment when confused about the process. The fix: Create a "How to Pay" section: "Option 1: Pay online instantly at [LINK], Option 2: Bank transfer to [Bank Name], Account: XXXX, Routing: YYYY, Option 3: Mail check to [Address]". Include screenshots for complex processes. Make your preferred method prominent with a green "RECOMMENDED" tag.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Late Invoice Sending:</strong> Mistake: Waiting days or weeks after project completion to invoice. Why it hurts: Every day delayed reduces payment likelihood by 2%. After 30 days, collection rates drop 25%. The fix: Invoice within 24 hours of completion, no exceptions. Set up templates in advance. For long projects, consider progress billing (25% milestones). Use automation to trigger invoices when projects are marked complete. Include "Invoice Date = Service Completion Date" to show promptness.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>No Follow-Up System:</strong> Mistake: Sending invoice once and hoping for the best. Why it hurts: 70% of late payments are simply forgotten, not disputed. The fix: Implement the 3-7-14-30 rule: Reminder at 3 days before due, on due date, 7 days late, 14 days late, 30 days for collections. Use different channels - email, text, phone. Track opens and clicks. Personalize based on client history. Good clients get gentle reminders, chronic late payers get firm notices.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Limited Payment Options:</strong> Mistake: Only accepting checks or bank transfers. Why it hurts: Creates friction, especially for younger clients used to one-click payments. The fix: Offer minimum 3 methods: Online payment (credit/debit cards), ACH/bank transfer (lower fees), Traditional check option. Consider: PayPal for small businesses, International wire for global clients, Payment plans for large invoices. Yes, card fees hurt, but getting paid 20 days sooner offsets the 3% cost.
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ bgcolor: 'grey.100', p: 3, borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: '600' }}>
                Key Takeaway
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Professional invoicing is a skill that directly impacts your business's cash flow and growth. By implementing the strategies in this guide, you can reduce your average payment time from 45 days to under 20 days, decrease late payments by 60%, and save 10+ hours per month on billing tasks. Start with the basics, then gradually implement advanced strategies as your business grows. Remember: every improvement to your invoicing process goes straight to your bottom line.
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </Paper>

      {/* Blog Posts Grid */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: '600', mb: 3 }}>
        Recent Articles
      </Typography>
      <Grid container spacing={3}>
        {blogPosts.map((post) => (
          <Grid item xs={12} md={6} key={post.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box sx={{ color: 'primary.main', mr: 2 }}>
                    {post.icon}
                  </Box>
                  <Box flexGrow={1}>
                    <Typography variant="caption" color="text.secondary">
                      {post.date} • {post.readTime}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: '600' }}>
                  {post.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {post.excerpt}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: '500', mb: 1 }}>
                    Key Takeaways:
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                    {post.content.slice(0, expandedPosts[post.id] ? post.content.length : 3).map((item, index) => (
                      <Typography key={index} component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {item}
                      </Typography>
                    ))}
                  </Box>
                  <Collapse in={expandedPosts[post.id]} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 2 }}>
                      {post.fullContent.split('\n\n').map((paragraph, idx) => (
                        <Typography 
                          key={idx} 
                          variant="body2" 
                          color="text.secondary" 
                          paragraph
                          sx={{ textAlign: 'justify' }}
                        >
                          {paragraph.trim()}
                        </Typography>
                      ))}
                    </Box>
                  </Collapse>
                </Box>
                
                <Box display="flex" gap={0.5} flexWrap="wrap">
                  {post.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary"
                  onClick={() => handleToggleExpand(post.id)}
                >
                  {expandedPosts[post.id] ? 'Read Less' : 'Read More'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Newsletter CTA */}
      <Paper sx={{ p: 4, mt: 6, textAlign: 'center', backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: '600' }} color="white">
          Get Business Tips Delivered to Your Inbox
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 3 }}  color="white">
          Join thousands of business owners who receive our monthly newsletter with invoicing tips, 
          business insights, and product updates.
        </Typography>
        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            color="secondary"
            size="large"
          >
            Subscribe to Newsletter
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            View All Articles
          </Button>
        </Box>
      </Paper>

      {/* Topics Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 3 }}>
          Browse by Topic
        </Typography>
        <Grid container spacing={2}>
          {['Getting Started', 'Best Practices', 'Payment Tips', 'Tax & Compliance', 'Automation', 'Client Relations'].map((topic) => (
            <Grid item key={topic}>
              <Chip
                label={topic}
                variant="outlined"
                onClick={() => {}}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
    
    <Footer />
    </>
  );
};

export default Blog;
