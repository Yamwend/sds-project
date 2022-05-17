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

describe('Ordonnances e2e test', () => {
  const ordonnancesPageUrl = '/ordonnances';
  const ordonnancesPageUrlPattern = new RegExp('/ordonnances(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const ordonnancesSample = {};

  let ordonnances: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/ordonnances+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/ordonnances').as('postEntityRequest');
    cy.intercept('DELETE', '/api/ordonnances/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (ordonnances) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/ordonnances/${ordonnances.id}`,
      }).then(() => {
        ordonnances = undefined;
      });
    }
  });

  it('Ordonnances menu should load Ordonnances page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('ordonnances');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Ordonnances').should('exist');
    cy.url().should('match', ordonnancesPageUrlPattern);
  });

  describe('Ordonnances page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(ordonnancesPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Ordonnances page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/ordonnances/new$'));
        cy.getEntityCreateUpdateHeading('Ordonnances');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', ordonnancesPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/ordonnances',
          body: ordonnancesSample,
        }).then(({ body }) => {
          ordonnances = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/ordonnances+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [ordonnances],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(ordonnancesPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Ordonnances page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('ordonnances');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', ordonnancesPageUrlPattern);
      });

      it('edit button click should load edit Ordonnances page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Ordonnances');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', ordonnancesPageUrlPattern);
      });

      it('last delete button click should delete instance of Ordonnances', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('ordonnances').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', ordonnancesPageUrlPattern);

        ordonnances = undefined;
      });
    });
  });

  describe('new Ordonnances page', () => {
    beforeEach(() => {
      cy.visit(`${ordonnancesPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Ordonnances');
    });

    it('should create an instance of Ordonnances', () => {
      cy.get(`[data-cy="numero"]`).type('Chicken').should('have.value', 'Chicken');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        ordonnances = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', ordonnancesPageUrlPattern);
    });
  });
});
