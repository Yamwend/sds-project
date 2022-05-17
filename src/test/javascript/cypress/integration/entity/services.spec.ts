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

describe('Services e2e test', () => {
  const servicesPageUrl = '/services';
  const servicesPageUrlPattern = new RegExp('/services(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const servicesSample = {};

  let services: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/services+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/services').as('postEntityRequest');
    cy.intercept('DELETE', '/api/services/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (services) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/services/${services.id}`,
      }).then(() => {
        services = undefined;
      });
    }
  });

  it('Services menu should load Services page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('services');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Services').should('exist');
    cy.url().should('match', servicesPageUrlPattern);
  });

  describe('Services page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(servicesPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Services page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/services/new$'));
        cy.getEntityCreateUpdateHeading('Services');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', servicesPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/services',
          body: servicesSample,
        }).then(({ body }) => {
          services = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/services+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [services],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(servicesPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Services page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('services');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', servicesPageUrlPattern);
      });

      it('edit button click should load edit Services page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Services');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', servicesPageUrlPattern);
      });

      it('last delete button click should delete instance of Services', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('services').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', servicesPageUrlPattern);

        services = undefined;
      });
    });
  });

  describe('new Services page', () => {
    beforeEach(() => {
      cy.visit(`${servicesPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Services');
    });

    it('should create an instance of Services', () => {
      cy.get(`[data-cy="libelleService"]`).type('invoice').should('have.value', 'invoice');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        services = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', servicesPageUrlPattern);
    });
  });
});
