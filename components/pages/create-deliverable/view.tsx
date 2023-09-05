import clsx from "clsx";
import { useTranslation } from "next-i18next";

import CreateBountyDescription from "components/bounty/create-bounty/create-bounty-description";
import BountyLabel from "components/bounty/create-bounty/create-bounty-label";
import CustomContainer from "components/custom-container";
import ResponsiveWrapper from "components/responsive-wrapper";

import FooterButtons from "./footer-buttons/view";

export default function CreateDeliverablePageView() {
  const { t } = useTranslation(["common", "custom-network", "bounty"]);

  return (
    <div className="row justify-content-center">
      <div className="col-md-10 bg-gray-900 border border-gray-800 border-radius-4 mt-5 p-4">
        <div>
          <h5>Create Deliverable</h5>
          <p className="text-gray-200">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
        <div className="pt-2">
          <span>Deliverable type</span>
          <p className="text-gray-200">
            Est quis sit irure exercitation id consequat cupidatat elit nulla
            velit amet ex.
          </p>
        </div>

        <div>
          <p className="text-gray-200">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>

        <div>
          <div className="row justify-content-center mb-3">
            <div className="col-md-12 m-0 mb-2">
              <div className="form-group">
                <BountyLabel className="mb-2 text-white" required>
                  Origin Link
                </BountyLabel>
                <input
                  type="text"
                  className={clsx("form-control bg-gray-850 rounded-lg", {
                    "border border-1 border-danger border-radius-8": false,
                  })}
                  placeholder={"github.com"}
                  value={""}
                />
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-12 m-0 mb-2">
              <div className="form-group">
                <BountyLabel className="mb-2 text-white">Preview</BountyLabel>
                <div className="d-flex justify-content-center border-dotter border-radius-4 border-gray-800">
                  <span className="p-5 text-gray-800">
                    Preview your embedded link
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center mb-3">
            <div className="col-md-12 m-0 mb-2">
              <div className="form-group">
                <BountyLabel className="mb-2 text-white" required>
                  Title
                </BountyLabel>
                <input
                  type="text"
                  className={clsx("form-control bg-gray-850 rounded-lg", {
                    "border border-1 border-danger border-radius-8": false,
                  })}
                  placeholder={"Deliverable title..."}
                  value={""}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <CreateBountyDescription
              description={""}
              handleChangeDescription={() => console.log}
              bodyLength={1}
              files={undefined}
              updateFiles={() => console.log}
              updateUploading={() => console.log}
            />
          </div>
        </div>
      </div>
      <CustomContainer className="d-flex flex-column justify-content-end">
        <ResponsiveWrapper className="row my-4" xs={false} md={true}>
          <FooterButtons
            handleBack={() => console.log}
            handleCreate={() => console.log}
          />
        </ResponsiveWrapper>
        <ResponsiveWrapper className="row my-4 mx-1" xs={true} md={false}>
          <FooterButtons
            handleBack={() => console.log}
            handleCreate={() => console.log}
          />
        </ResponsiveWrapper>
      </CustomContainer>
    </div>
  );
}
