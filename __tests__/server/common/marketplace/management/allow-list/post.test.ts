import { NextApiRequest } from "next";

import { updateAllowListByType } from "helpers/api/marketplace/management/update-allow-list";

import { AllowListTypes } from "interfaces/enums/marketplace";

import post from "server/common/marketplace/management/allow-list/post";

jest.mock("helpers/api/marketplace/management/update-allow-list", () => ({
  updateAllowListByType: jest.fn()
}));

describe("marketplace/management/allow-list#post", () => {
  let mockedRequest: NextApiRequest;

  beforeEach(() => {
    mockedRequest = {
      query: {
        networkId: 1,
        address: "0x01234",
        type: AllowListTypes.OPEN_TASK
      }
    } as unknown as NextApiRequest;
    jest.clearAllMocks();
  });

  it("Should call updateAllowListByType with correct params", async () => {
    await post(mockedRequest)
    expect(updateAllowListByType)
      .toHaveBeenCalledWith(mockedRequest.query.address,
                            mockedRequest.query.networkId,
                            mockedRequest.query.type,
                            "add");
  });
});