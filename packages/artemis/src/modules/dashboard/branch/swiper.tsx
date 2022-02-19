import { Mousewheel } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { useBreakpointValue } from "@chakra-ui/react";
import { BranchCard } from "./card";

export const BranchSwiper: React.FC = () => {
  const slidesPerView = useBreakpointValue({
    base: 1,
    md: 1.5,
    lg: 2,
    xl: 3,
    "2xl": 3.5,
  });

  return (
    <Swiper
      slidesPerView={slidesPerView}
      spaceBetween={50}
      mousewheel={true}
      modules={[Mousewheel]}
    >
      {[...Array(10)].map((branch) => (
        <SwiperSlide>
          <BranchCard />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
