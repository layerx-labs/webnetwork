import PageHero from "components/common/page-hero/view";

import { render } from "__tests__/utils/custom-render";

describe("PageHeroView", () => {
  it("Should render title", async () => {
    const title = "Curators";
    const result = render(<PageHero
                            title={title}
                            infos={[]}
                          />);
    const found = result.queryAllByText(title);
    expect(found.length).toBeGreaterThan(0);
  });

  it("Should render subtitle", async () => {
    const title = "Curators";
    const subtitle = "SubTitle";
    const result = render(<PageHero
      title={title}
      infos={[]}
      subtitle={subtitle}
    />);
    const found = result.queryAllByText(subtitle);
    expect(found.length).toBeGreaterThan(0);
  });

  it("Should render infos", async () => {
    const title = "Curators";
    const infos = [
      {
        label: "Info1",
        value: 11111
      },
    ];
    const result = render(<PageHero
      title={title}
      infos={infos}
    />);
    const foundInfoLabel = result.queryAllByText(infos[0].label);
    const foundInfoValue = result.queryAllByText(infos[0].value);
    expect(foundInfoLabel.length).toBeGreaterThan(0);
    expect(foundInfoValue.length).toBeGreaterThan(0);
  });
});