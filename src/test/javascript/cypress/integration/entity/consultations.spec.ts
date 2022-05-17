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

describe('Consultations e2e test', () => {
  const consultationsPageUrl = '/consultations';
  const consultationsPageUrlPattern = new RegExp('/consultations(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const consultationsSample = {};

  let consultations: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/consultations+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/consultations').as('postEntityRequest');
    cy.intercept('DELETE', '/api/consultations/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (consultations) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/consultations/${consultations.id}`,
      }).then(() => {
        consultations = undefined;
      });
    }
  });

  it('Consultations menu should load Consultations page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('consultations');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Consultations').should('exist');
    cy.url().should('match', consultationsPageUrlPattern);
  });

  describe('Consultations page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(consultationsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Consultations page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/consultations/new$'));
        cy.getEntityCreateUpdateHeading('Consultations');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', consultationsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/consultations',
          body: consultationsSample,
        }).then(({ body }) => {
          consultations = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/consultations+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [consultations],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(consultationsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Consultations page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('consultations');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', consultationsPageUrlPattern);
      });

      it('edit button click should load edit Consultations page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Consultations');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', consultationsPageUrlPattern);
      });

      it('last delete button click should delete instance of Consultations', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('consultations').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', consultationsPageUrlPattern);

        consultations = undefined;
      });
    });
  });

  describe('new Consultations page', () => {
    beforeEach(() => {
      cy.visit(`${consultationsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Consultations');
    });

    it('should create an instance of Consultations', () => {
      cy.get(`[data-cy="typeConsultation"]`).select('CPS');

      cy.get(`[data-cy="observationsConsltation"]`).type('Molière').should('have.value', 'Molière');

      cy.get(`[data-cy="fraisConsultion"]`).type('66688').should('have.value', '66688');

      cy.get(`[data-cy="dateConsultion"]`).type('2022-05-16T20:37').should('have.value', '2022-05-16T20:37');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        consultations = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', consultationsPageUrlPattern);
    });
  });
});
