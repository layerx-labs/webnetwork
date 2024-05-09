import models from "db/models";

import { put } from "server/common/points-base/bulk-update/put";
import { HttpBadRequestError } from "server/errors/http-errors";

jest.mock("db/models", () => ({
  pointsBase: {
    update: jest.fn()
  }
}));

describe("BulkUpdatePointsBase", () => {
  let request = null;

  beforeEach(() => {
    jest.clearAllMocks();
    request = {
      body: {
        rows: [
          {
            id: 1,
            actionName: "action1",
            scalingFactor: 1,
            pointsPerAction: 1,
            counter: "1"
          }
        ]
      }
    }
  });

  it("Should update sucessfully", async () => {
    await put(request);
    expect(models.pointsBase.update)
      .toHaveBeenCalledWith({
        scalingFactor: 1,
        pointsPerAction: 1,
        counter: "1"
      }, {
        where: {
          id: 1
        }
      });
  });

  it("Should throws because no rows was sent", async () => {
    request.body = {};
    await expect(() => put(request)).rejects.toThrow(new HttpBadRequestError("Missing rows to update"));
  });

  it("Should throws because id was not provided", async () => {
    request.body = {
      rows: [
        {
          actionName: "action1",
          scalingFactor: 1,
          pointsPerAction: 1,
          counter: "1"
        }
      ]
    };
    await expect(() => put(request)).rejects.toThrow(new HttpBadRequestError("Missing paramaters for action1"));
  });

  it("Should throws because no changed column was provided", async () => {
    request.body = {
      rows: [
        {
          id: 1,
          actionName: "action1"
        }
      ]
    };
    await expect(() => put(request)).rejects.toThrow(new HttpBadRequestError("Missing paramaters for action1"));
  });

  it("Should throws because scalingFactor is invalid", async () => {
    request.body = {
      rows: [
        {
          id: 1,
          actionName: "action1",
          scalingFactor: 0,
        }
      ]
    };
    await expect(() => put(request)).rejects.toThrow(new HttpBadRequestError("Invalid paramaters for action1"));
  });

  it("Should throws because pointsPerAction is invalid", async () => {
    request.body = {
      rows: [
        {
          id: 1,
          actionName: "action1",
          pointsPerAction: 0,
        }
      ]
    };
    await expect(() => put(request)).rejects.toThrow(new HttpBadRequestError("Invalid paramaters for action1"));
  });

  it("Should throws because counter is invalid", async () => {
    request.body = {
      rows: [
        {
          id: 1,
          actionName: "action1",
          counter: "B",
        }
      ]
    };
    await expect(() => put(request)).rejects.toThrow(new HttpBadRequestError("Invalid paramaters for action1"));
  });
});