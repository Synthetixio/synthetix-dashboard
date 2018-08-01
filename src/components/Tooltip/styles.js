import { css } from "emotion";

export default {
  container: css`
    background: #11112F;
    border: 1px solid #25244B;
    box-shadow: 0 5px 10px 0 rgba(255,255,255,0.06);
    border-radius: 4px;
    padding: 10px;
    text-align: right;
    overflow: 'visible';
  `,
  USD: css`
    color: #53B167;
    padding-right:10px;
    padding-left:5px;  
  `,
  BTC: css`
    color: #D9AB44;
    padding-right:10px;
    padding-left:5px;  
  `,
  ETH: css`
    color: #42217E;
    padding-right:10px;
    padding-left:5px;  
  `,

  text: css`
    font-size: 14px;
    letter-spacing: -0.49px;
  `,
  value: css`
    color: #FFFFFF;
    font-variant: tabular-nums;
  `,
  dateSm: css`
  padding:10px;
    font-size: 12px;
    color: #6F6E98;
    letter-spacing: 0.56px;
  `,

};
