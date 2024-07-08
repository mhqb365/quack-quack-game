const RARE_DUCK = [undefined, "COMMON", "RARE", "LEGENDARY"];

function rareDuck(metadata) {
  return [
    RARE_DUCK[metadata.head_rare],
    RARE_DUCK[metadata.arm_rare],
    RARE_DUCK[metadata.body_rare],
  ].join(", ");
}

module.exports = rareDuck;
