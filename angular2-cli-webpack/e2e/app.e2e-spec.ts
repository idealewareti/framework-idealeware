import { IdealecommercePage } from './app.po';

describe('idealecommerce App', () => {
  let page: IdealecommercePage;

  beforeEach(() => {
    page = new IdealecommercePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
