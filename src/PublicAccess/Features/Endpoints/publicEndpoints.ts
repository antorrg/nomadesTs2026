import type { EmailInput } from "../Contact/validContact";

export const sendEmails = async (
    input: EmailInput,
    onClose: () => void,
    onReject: () => void
): Promise<void> => {
    // Simulating a network request delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate randomness for rejection testing if needed (optional, currently deterministic success)
    const success = true;

    if (success) {
        console.log("Email sent successfully with data:", input);
        onClose();
    } else {
        console.log("Email sending failed (simulated).");
        onReject();
    }
};

export const handleWhatsApp = (): void => {
    console.log("WhatsApp button clicked");
    // Logic to open WhatsApp would go here, e.g.:
    // window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
};
