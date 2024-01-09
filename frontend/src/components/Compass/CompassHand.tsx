type Props = { rotation: number; type: String };

const CompassHand = (props: Props) => {
  return (
    <img
      src={props.type + "Arrow.svg"}
      alt={"The arrow pointing in the " + props.type + " direction"}
      className="arrow"
      style={{ transform: "rotate(" + props.rotation + "deg)" }}
    />
  );
};

export default CompassHand;
