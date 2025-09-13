# Email Notification Setup

I've set up a simple email notification system using Formspree. Here's how to get it working:

## Option 1: Formspree (Recommended - Free & Easy)

### Step 1: Create Formspree Account

1. Go to [formspree.io](https://formspree.io)
2. Sign up for a free account
3. Create a new form
4. Set the email to receive notifications: `talhanadeem22.dev@gmail.com`

### Step 2: Get Your Form ID

1. After creating the form, you'll get a form endpoint like: `https://formspree.io/f/xpzgkqwe`
2. Copy the form ID (the part after `/f/`)

### Step 3: Update Your Code

1. Open `script.js`
2. Find this line: `const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';`
3. Replace `YOUR_FORM_ID` with your actual form ID
4. Save and deploy

### Step 4: Test

1. Deploy your site to Vercel
2. Try submitting an email
3. Check your email - you should receive notifications!

---

## Option 2: Netlify Forms (If using Netlify)

If you prefer to use Netlify instead of Vercel:

### Step 1: Add Netlify Form Attributes

Add these attributes to your form in `index.html`:

```html
<form
  name="waitlist"
  method="POST"
  data-netlify="true"
  netlify-honeypot="bot-field"
>
  <input type="hidden" name="form-name" value="waitlist" />
  <input
    type="email"
    name="email"
    placeholder="Enter your email address"
    required
  />
  <button type="submit">Join Waitlist</button>
</form>
```

### Step 2: Deploy to Netlify

1. Connect your GitHub repo to Netlify
2. Deploy
3. Netlify will automatically handle form submissions and email you

---

## Option 3: EmailJS (More Advanced)

If you want more control over the email template:

### Step 1: Create EmailJS Account

1. Go to [emailjs.com](https://emailjs.com)
2. Sign up for free
3. Connect your Gmail account
4. Create an email template

### Step 2: Update the Code

Replace the Formspree code in `script.js` with EmailJS code:

```javascript
// Add EmailJS script to your HTML head
// <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

async submitToEmailService(email, emailInput, button) {
    try {
        emailjs.init('YOUR_EMAILJS_PUBLIC_KEY');

        const templateParams = {
            to_email: 'talhanadeem22.dev@gmail.com',
            from_email: email,
            message: `New waitlist signup: ${email}`,
            timestamp: new Date().toLocaleString()
        };

        await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);

        this.setButtonLoading(button, false);
        this.showSuccess(emailInput, 'Successfully joined the waitlist!');
        emailInput.value = '';
        this.trackConversion(email);

    } catch (error) {
        console.error('Error:', error);
        this.setButtonLoading(button, false);
        this.showError(emailInput, 'Something went wrong. Please try again.');
    }
}
```

---

## Current Setup

Right now, the code is configured for **Formspree** (Option 1). This is the easiest and most reliable option.

### What happens when someone signs up:

1. User enters email and clicks "Join Waitlist"
2. JavaScript sends the email to Formspree
3. Formspree sends you an email notification at `talhanadeem22.dev@gmail.com`
4. User sees success message

### Email format you'll receive:

```
From: Formspree <noreply@formspree.io>
To: talhanadeem22.dev@gmail.com
Subject: New submission from Compound Waitlist Landing Page

Email: user@example.com
Timestamp: 2024-01-15T10:30:00.000Z
Source: Compound Waitlist Landing Page
Message: New waitlist signup from Compound landing page
```

Just follow Option 1 above and you'll be receiving email notifications for every signup!
