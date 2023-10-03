import {Col, Row} from "react-bootstrap";

import ProfileLayout from "components/profile/profile-layout";

import { WalletPageProps } from "types/pages";

import WalletBalance from "./wallet-balance/controller";

export default function WalletPage({
  tokens,
  chains
}: WalletPageProps) {
  return (
    <ProfileLayout>
      <Col xs={12}>
        <Row className="mb-3">
          <WalletBalance dbTokens={tokens} chains={chains}/>
        </Row>
      </Col>
    </ProfileLayout>
  );
}