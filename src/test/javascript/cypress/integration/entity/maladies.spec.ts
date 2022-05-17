import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Maladies e2e test', () => {
  const maladiesPageUrl = '/maladies';
  const maladiesPageUrlPattern = new RegExp('/maladies(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const maladiesSample = {};

  let maladies: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/maladies+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/maladies').as('postEntityRequest');
    cy.intercept('DELETE', '/api/maladies/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (maladies) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/maladies/${maladies.id}`,
      }).then(() => {
        maladies = undefined;
      });
    }
  });

  it('Maladies menu should load Maladies page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('maladies');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Maladies').should('exist');
    cy.url().should('match', maladiesPageUrlPattern);
  });

  describe('Maladies page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(maladiesPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Maladies page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/maladies/new$'));
        cy.getEntityCreateUpdateHeading('Maladies');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', maladiesPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/maladies',
          body: maladiesSample,
        }).then(({ body }) => {
          maladies = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/maladies+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [maladies],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(maladiesPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Maladies page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('maladies');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', maladiesPageUrlPattern);
      });

      it('edit button click should load edit Maladies page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Maladies');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', maladiesPageUrlPattern);
      });

      it('last delete button click should delete instance of Maladies', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('maladies').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', maladiesPageUrlPattern);

        maladies = undefined;
      });
    });
  });

  describe('new Maladies page', () => {
    beforeEach(() => {
      cy.visit(`${maladiesPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Maladies');
    });

    it('should create an instance of Maladies', () => {
      cy.get(`[data-cy="nomMaladie"]`)
        .type('engage Champagne-Ardenne Ergonomic')
        .should('have.value', 'engage Champagne-Ardenne Ergonomic');

      cy.get(`[data-cy="familleMaladie"]`).type('wireless').should('have.value', 'wireless');

      cy.get(`[data-cy="descriptionMaladie"]`).type('b Checking').should('have.value', 'b Checking');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        maladies = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', maladiesPageUrlPattern);
    });
  });
});
