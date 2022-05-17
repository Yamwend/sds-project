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

describe('Hospitalisations e2e test', () => {
  const hospitalisationsPageUrl = '/hospitalisations';
  const hospitalisationsPageUrlPattern = new RegExp('/hospitalisations(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const hospitalisationsSample = {};

  let hospitalisations: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/hospitalisations+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/hospitalisations').as('postEntityRequest');
    cy.intercept('DELETE', '/api/hospitalisations/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (hospitalisations) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/hospitalisations/${hospitalisations.id}`,
      }).then(() => {
        hospitalisations = undefined;
      });
    }
  });

  it('Hospitalisations menu should load Hospitalisations page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('hospitalisations');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Hospitalisations').should('exist');
    cy.url().should('match', hospitalisationsPageUrlPattern);
  });

  describe('Hospitalisations page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(hospitalisationsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Hospitalisations page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/hospitalisations/new$'));
        cy.getEntityCreateUpdateHeading('Hospitalisations');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', hospitalisationsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/hospitalisations',
          body: hospitalisationsSample,
        }).then(({ body }) => {
          hospitalisations = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/hospitalisations+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [hospitalisations],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(hospitalisationsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Hospitalisations page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('hospitalisations');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', hospitalisationsPageUrlPattern);
      });

      it('edit button click should load edit Hospitalisations page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Hospitalisations');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', hospitalisationsPageUrlPattern);
      });

      it('last delete button click should delete instance of Hospitalisations', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('hospitalisations').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', hospitalisationsPageUrlPattern);

        hospitalisations = undefined;
      });
    });
  });

  describe('new Hospitalisations page', () => {
    beforeEach(() => {
      cy.visit(`${hospitalisationsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Hospitalisations');
    });

    it('should create an instance of Hospitalisations', () => {
      cy.get(`[data-cy="dateArrivee"]`).type('2022-05-16T11:20').should('have.value', '2022-05-16T11:20');

      cy.get(`[data-cy="dateSortie"]`).type('2022-05-16T21:53').should('have.value', '2022-05-16T21:53');

      cy.get(`[data-cy="observationsHospitalisation"]`).type('hacking').should('have.value', 'hacking');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        hospitalisations = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', hospitalisationsPageUrlPattern);
    });
  });
});
