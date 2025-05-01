import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Basic validation (can be expanded)
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // --- Add your email sending logic here ---
    // Example using console.log:
    console.log("Received contact form submission:");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);

    // Example: Send email using Nodemailer or a service like Resend/SendGrid
    // try {
    //   await sendEmail({ to: 'your-email@example.com', subject, html: messageBody });
    // } catch (emailError) {
    //   console.error('Email sending failed:', emailError);
    //   return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    // }
    // -------------------------------------------

    return NextResponse.json({ message: 'Message received successfully!' }, { status: 200 });

  } catch (error) {
    console.error("Error processing contact form:", error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 