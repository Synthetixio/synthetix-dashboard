import { css } from "emotion";

export default {
  container: css`
    background: #11112f;
    border: 1px solid #25244b;
    box-shadow: 0 5px 10px 0 rgba(255, 255, 255, 0.06);
    border-radius: 4px;
    padding: 10px;
    text-align: right;
    overflow: "visible";
  `,
  USD: css`
    color: #53b167;
    padding-right: 10px;
    padding-left: 5px;
  `,
  BTC: css`
    color: #d9ab44;
    padding-right: 10px;
    padding-left: 5px;
  `,
  ETH: css`
    color: #42217e;
    padding-right: 10px;
    padding-left: 5px;
  `,

  text: css`
    font-size: 14px;
    letter-spacing: -0.49px;
  `,
  value: css`
    color: #ffffff;
    font-variant: tabular-nums;
  `,
  dateSm: css`
    padding: 10px;
    font-size: 12px;
    color: #6f6e98;
    letter-spacing: 0.56px;
  `
};
