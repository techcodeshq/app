import { Mousewheel } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { EventCard } from "./card";
import { useBreakpointValue } from "@chakra-ui/react";

export const EventsSwiper: React.FC = () => {
  const slidesPerView = useBreakpointValue({
    base: 0,
    sm: 1,
    md: 1.5,
    lg: 2.5,
    xl: 3.5,
    "2xl": 4,
  });

  return (
    <Swiper
      slidesPerView={slidesPerView}
      spaceBetween={30}
      mousewheel={true}
      modules={[Mousewheel]}
    >
      {[...Array(10)].map((_, index) => (
        <SwiperSlide key={index}>
          <EventCard />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
