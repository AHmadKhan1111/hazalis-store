import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "How do I track my order?",
      answer:
        "Once your order has shipped, you will receive an email with a tracking number and a link to track your package. You can also track your order on our 'Order Tracking' page using your order ID.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for all items in their original condition with tags attached. Please visit our Shipping & Returns page for more details.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we currently ship to over 50 countries worldwide. International shipping rates and delivery times vary by location.",
    },
    {
      question: "How can I change or cancel my order?",
      answer:
        "Please contact our customer support team as soon as possible if you need to change or cancel your order. Once an order has been processed, we may not be able to make changes.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay.",
    },
    {
      question: "How do I determine my size?",
      answer:
        "We provide a detailed size guide on every product page to help you find the perfect fit. If you're between sizes, we generally recommend sizing up for the best comfort.",
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500 text-center mb-12">
          Find quick answers to the most common questions about our products and
          services.
        </p>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              <div
                className={`transition-all duration-300 ease-in-out px-6 overflow-hidden ${
                  openIndex === index
                    ? "max-h-96 pb-6 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Still have questions?</p>
          <a
            href="/shop/contact"
            className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Contact Customer Support
          </a>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
