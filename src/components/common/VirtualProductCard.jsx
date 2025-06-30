import ProductCard from "./ProductCard";
import Skeleton from "@mui/material/Skeleton";
import { useInView } from "react-intersection-observer";

export default function VirtualProductCard(props) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "-200px 0px" });
  return (
    <div ref={ref} className="product-card rounded-md relative min-w-[270px] min-h-[350px] [direction:ltr]">
      {inView ? (
        <ProductCard {...props} />
      ) : (
        <div>
          <Skeleton variant="rectangular" width="100%" height="250px" className="mb-3 rounded" />
          <div className="flex flex-col ms-3">
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="30%" />
          </div>
        </div>
      )}
    </div>
  );
}
