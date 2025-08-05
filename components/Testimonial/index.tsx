// TestimonialCarousel.tsx

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { AuroraText } from "@/components/magicui/aurora-text";
// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";

const testimonials = [
  {
    name: "Johnson Chin",
    role: "Donor",
    initial: "S",
    text: "Fundit8 has completely changed how I think about charitable giving. The transparency and real-time tracking give me confidence that my donations are making a real impact.",
  },
  {
    name: "Michael Wong",
    role: "Organization Leader",
    initial: "M",
    text: "As a charity organization, Fundit8's blockchain technology helps us build trust with donors. The platform makes it easy to show exactly how funds are being used.",
  },
  {
    name: "Lisa Rodriguez",
    role: "Regular Donor",
    initial: "E",
    text: "I love how easy it is to track my donations and see the real impact. Fundit8 makes charitable giving feel more personal and meaningful.",
  },
  {
    name: "David Kim",
    role: "Philanthropist",
    initial: "D",
    text: "The AI-powered donation predictions on Fundit8 are incredible. It helps me make more informed decisions about where my money will have the greatest impact.",
  },
  {
    name: "Kendrick Wang",
    role: "Charity Director",
    initial: "L",
    text: "Fundit8's platform has revolutionized our fundraising efforts. The transparency features help us build stronger relationships with our donors.",
  },
];

export default function TestimonialCarousel() {
  return (
    <section className="bg-gray-50 py-12">
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how Fundit8 is transforming charitable giving with
              transparency and impact
            </p>
          </div>
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop={true}
          >
            {testimonials.map((t, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {t.initial}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900">{t.name}</h4>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{t.text}</p>
                  <div className="flex text-yellow-400 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </section>
  );
}
