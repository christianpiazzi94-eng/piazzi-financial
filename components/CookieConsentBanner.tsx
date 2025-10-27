// components/CookieConsentBanner.tsx
'use client';

import CookieConsent from "react-cookie-consent";
import { useCallback } from "react";

// Function to fire the pageview event to GA4 only AFTER consent is given
const sendGAConsent = () => {
    // Check if the gtag function exists (GA4 script is loaded)
    if (typeof window.gtag === 'function') {
        // Send the initial pageview, which was blocked in layout.tsx
        window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
            'send_page_view': true 
        });
    }
};

export default function CookieConsentBanner() {
    
    // The useCallback hook memoizes the function for performance
    const handleAccept = useCallback(() => {
        sendGAConsent(); // Fire the GA4 event on acceptance
    }, []);

    return (
        <CookieConsent
            // --- STYLE CHANGES ARE HERE ---
            style={{ 
                background: "#202020", // Neutral Dark Grey Background
                color: "#FFFFFF",      // White Text
                alignItems: 'center',
                padding: '10px 0',
            }}
            buttonStyle={{ 
                background: "#FFFFFF", // White Button Background
                color: "#202020",      // Dark Button Text
                borderRadius: "8px", 
                fontSize: "13px",
                fontWeight: "600",
                padding: "8px 16px"
            }}
            // --- NEW: Added styling for the decline button ---
            declineButtonStyle={{
                background: "none", // No background
                color: "#FFFFFF",     // White text
                fontSize: "13px",
                fontWeight: "600",
            }}
            // ---------------------------------
            location="bottom"
            buttonText="Accept & Continue"
            declineButtonText="Only Necessary"
            cookieName="piazzi_financial_consent"
            expires={150} // Expires after 150 days
            enableDeclineButton
            onAccept={handleAccept}
            // Note: If declined, the GA4 tracking remains blocked
        >
            We use cookies to analyze site traffic and improve your experience. This data helps us optimize our content. 
            By clicking "Accept", you agree to our use of non-essential analytics.
        </CookieConsent>
    );
}