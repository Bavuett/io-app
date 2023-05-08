import React from "react";
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";
import { SVGPictogramProps } from "../Pictogram";

const PictogramSetup = ({ size, color, ...props }: SVGPictogramProps) => (
  <Svg width={size} height={size} viewBox="0 0 72 72" {...props}>
    <G clip-path="url(#a)">
      <Path
        d="M1.80469 55.2894c.85957-1.2322 21.14831-30.239 29.45441-33.5325 5.3163-2.103 7.8483.3937 8.6892 1.5657 1.1212 1.561 1.4809 3.6455 1.0979 5.4752 3.3028-1.1163 9.2077-2.997 13.286-3.6131 1.1445-.1714 2.2844.1112 3.2141.8014.9436.7041 1.5416 1.7232 1.6958 2.8766.2943 2.2142-1.1399 4.2523-3.3309 4.7433-6.9934 1.5657-11.8332 3.0619-13.2814 4.1088l-1.2987-1.7649c2.1863-1.5795 8.8714-3.3027 14.0943-4.47 1.0744-.2409 1.7752-1.2415 1.635-2.3254-.0747-.5698-.3644-1.0654-.8362-1.4175-.4531-.3335-1.0044-.4724-1.5603-.3891-5.5919.8431-15.2201 4.3265-15.3182 4.3636-.4718.1714-.9997 0-1.2847-.4077-.285-.4076-.2569-.9588.0747-1.334 1.0044-1.1488 1.224-3.6919.0187-5.378-1.1539-1.6074-3.3168-1.9038-6.0777-.806-6.3861 2.5292-22.70869 24.495-28.45943 32.745l-1.81258-1.2414Z"
        fill="#0B3EE3"
      />
      <Path
        d="m46.0536 45.1832-1.4716-1.6259c1.565-1.3989 6.0731-2.5477 13.3935-3.4139 1.9434-.2316 3.3402-1.9919 3.1207-3.9281-.1682-1.4823-1.2661-2.7099-2.7236-3.0573l-1.1679-.2779.5139-2.1262 1.1679.2779c2.3545.5652 4.125 2.5431 4.396 4.9333.3597 3.1221-1.906 5.9709-5.05 6.3415-9.5955 1.1395-11.7538 2.4829-12.1836 2.8673l.0047.0093Z"
        fill="#0B3EE3"
      />
      <Path
        d="M24.0234 78.6863c1.4669-2.1308 10.6046-13.8085 11.623-15.1241 6.9887-9.0374 19.1909-13.8873 24.1148-15.5549.8035-.2733 1.4202-.9264 1.6397-1.7463.2289-.8524-.0093-1.7742-.626-2.4134l-1.962-2.0335 1.593-1.5101 1.9621 2.0335c1.1398 1.1812 1.5883 2.8997 1.1632 4.484-.4111 1.5286-1.5557 2.7422-3.0552 3.2518-4.737 1.6027-16.4581 6.2534-23.0778 14.8184-.981 1.2692-10.1046 12.9192-11.5528 15.0268l-1.822-1.2322ZM34.2152 33.7086l-3.9906 3.9957 1.5635 1.5352 3.9905-3.9958-1.5634-1.5351Z"
        fill="#0B3EE3"
      />
      <Path
        d="M29.1703 48.4771c2.3731-5.0583-.3317-13.5214-.3598-13.6047l2.0976-.6717c.1261.3798 2.9992 9.357.2569 15.1982l-1.9947-.9218ZM40.8798 33.5402l-1.913 1.0872 8.0448 13.9173 1.9131-1.0872-8.0449-13.9173Z"
        fill="#0B3EE3"
      />
      <Path
        d="M40.0727 9.99708c-.0144 1.22232-1.2093 1.90452-2.2328 1.32352-.239-.135-.4393-.3447-.6372-.54-2.9691-2.96527-5.9333-5.93294-8.8976-8.90061-.1689-.16876-.3475-.3351-.4851-.52796-.4538-.6461-.3669-1.4296.1955-1.95274.5359-.49903 1.2504-.55689 1.8707-.135.1642.1109.3066.25554.4466.39778 3.027 3.02071 6.0491 6.04141 9.0785 9.05971.379.37608.7097.76422.6614 1.27772v-.00242ZM52.9602 11.5284c-.6145.0193-1.0772-.1739-1.3639-.6713-.3013-.5216-.3085-1.07708.012-1.58905.1663-.26564.4121-.4854.6386-.7124 2.8772-2.88584 5.7545-5.77168 8.6341-8.65268.2265-.2246.4458-.46608.7061-.6472.6096-.42262 1.335-.34534 1.8603.16663.5229.50713.6265 1.24368.2241 1.85708-.1735.26322-.4096.48781-.6337.71481-2.9038 2.91482-5.8124 5.82722-8.7185 8.73961-.3952.3961-.7687.8332-1.3567.7945h-.0024ZM46.9789.2352v6.05446c0 .31563.0122.63844-.0346.9469-.1057.71496-.5876 1.15494-1.2159 1.15733-.6323 0-1.1142-.43519-1.224-1.14776-.0427-.27021-.0326-.55237-.0326-.82735V-5.92924c0-.27738-.0101-.55954.0305-.82974.1037-.69822.6019-1.15972 1.2159-1.15972.6141 0 1.1204.45432 1.2241 1.15015.0468.30847.0325.63127.0346.94691.002 2.01815 0 4.0363 0 6.05445l.002.0024ZM62.0419 15.3017c2.1814 0 4.3651-.0177 6.5464.0076 1.0906.0126 1.679.6802 1.5977 1.7068-.055.6979-.5238 1.2593-1.1863 1.3655-.311.0506-.6339.0329-.9496.0329H56.0266c-.1579 0-.3205-.0202-.476.0025-.8969.1391-1.6862-.6701-1.6695-1.5324.0168-.971.5645-1.5349 1.6145-1.5829.2368-.0101.476-.0026.7151-.0026h5.8336l-.0024.0026Z"
        fill="#AAEEEF"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h72v72H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default PictogramSetup;
