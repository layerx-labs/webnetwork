import {Col, Row} from "react-bootstrap";

import DashboardLayout from "components/profile/dashboard-layout";
import WalletBalance from "components/profile/pages/wallet/wallet-balance/controller";

import { WalletPageProps } from "types/pages";

export default function WalletPage({
  chains,
  tokens
}: WalletPageProps) {
  return (
    <DashboardLayout>
      <Col xs={12}>
        <Row className="mb-3">
          <WalletBalance chains={chains} tokens={tokens} />
        </Row>
      </Col>
    </DashboardLayout>
  );
}