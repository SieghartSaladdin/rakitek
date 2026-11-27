"use client";

import { BookclubFaqAccordion } from "./component";

export default function BookclubFaqAccordionPreview() {
  return (
    <BookclubFaqAccordion
      id="faq"
      title="Common questions"
      items={[
        {
          id: "membership-cost",
          question: "How much does membership cost, my wallet is asking?",
          answer: "In the USA, membership is $17.99 USD/month (accounts for 1 book) and $10.99 for each extra book. In Canada, membership is $25.99 CAD/month (accounts for 1 book) and $15.99 for each extra book.",
        },
        {
          id: "shipping-countries",
          question: "What countries do you ship to?",
          answer: "We ship to the USA & Canada! Please contact support if you are mailing to Puerto Rico, an APO/FPO address, or PO box so we can set up your account.",
          contactEmail: "hello@fableandfold.example",
        },
        {
          id: "how-to-join",
          question: "How do I join the club?",
          answer: "You can sign up for membership by downloading our mobile app or by using our website. Place your first order to kickstart your membership!",
        },
      ]}
      ctaLabel="Show all FAQ"
      ctaHref="#faq"
      ctaExternal={false}
      showCta
      popupTitle="Want to join the Club?"
      popupCtaLabel="Sign-up now!"
      popupCtaHref="#signup"
      showPopup
    />
  );
}
