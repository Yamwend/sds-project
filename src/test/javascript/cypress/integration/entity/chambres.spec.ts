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

describe('Chambres e2e test', () => {
  const chambresPageUrl = '/chambres';
  const chambresPageUrlPattern = new RegExp('/chambres(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const chambresSample = {};

  let chambres: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/chambres+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/chambres').as('postEntityRequest');
    cy.intercept('DELETE', '/api/chambres/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (chambres) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/chambres/${chambres.id}`,
      }).then(() => {
        chambres = undefined;
      });
    }
  });

  it('Chambres menu should load Chambres page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('chambres');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Chambres').should('exist');
    cy.url().should('match', chambresPageUrlPattern);
  });

  describe('Chambres page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(chambresPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Chambres page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/chambres/new$'));
        cy.getEntityCreateUpdateHeading('Chambres');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', chambresPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/chambres',
          body: chambresSample,
        }).then(({ body }) => {
          chambres = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/chambres+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [chambres],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(chambresPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Chambres page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('chambres');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', chambresPageUrlPattern);
      });

      it('edit button click should load edit Chambres page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Chambres');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', chambresPageUrlPattern);
      });

      it('last delete button click should delete instance of Chambres', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('chambres').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', chambresPageUrlPattern);

        chambres = undefined;
      });
    });
  });

  describe('new Chambres page', () => {
    beforeEach(() => {
      cy.visit(`${chambresPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Chambres');
    });

    it('should create an instance of Chambres', () => {
      cy.get(`[data-cy="numeroChambre"]`).type('a Centre calculate').should('have.value', 'a Centre calculate');

      cy.get(`[data-cy="localisationChambre"]`).type('Auto channels').should('have.value', 'Auto channels');

      cy.get(`[data-cy="nombrebLit"]`).type('9264').should('have.value', '9264');

      cy.get(`[data-cy="prixChambre"]`).type('46116').should('have.value', '46116');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        chambres = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', chambresPageUrlPattern);
    });
  });
});
