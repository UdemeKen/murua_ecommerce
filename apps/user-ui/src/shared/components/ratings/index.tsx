import HalfStar from "apps/user-ui/src/assets/svgs/half-star";
import StarFilled from "apps/user-ui/src/assets/svgs/star-filled";
import StarOutline from "apps/user-ui/src/assets/svgs/star-outline";
import React, { FC } from "react";

type Props = {
  rating: number;
};

const Ratings: FC<Props> = ({ rating }) => {
  const numericRating = Number(rating) || 0;

  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(numericRating)) {
      stars.push(<StarFilled key={i} />);
    } else if (
      i === Math.ceil(numericRating) &&
      numericRating % 1 !== 0
    ) {
      stars.push(<HalfStar key={i} />);
    } else {
      stars.push(<StarOutline key={i} />);
    }
  }

  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {stars}
    </div>
  );
};

export default Ratings;