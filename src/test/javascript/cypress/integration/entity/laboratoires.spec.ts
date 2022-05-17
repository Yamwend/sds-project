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

describe('Laboratoires e2e test', () => {
  const laboratoiresPageUrl = '/laboratoires';
  const laboratoiresPageUrlPattern = new RegExp('/laboratoires(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const laboratoiresSample = {};

  let laboratoires: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/laboratoires+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/laboratoires').as('postEntityRequest');
    cy.intercept('DELETE', '/api/laboratoires/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (laboratoires) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/laboratoires/${laboratoires.id}`,
      }).then(() => {
        laboratoires = undefined;
      });
    }
  });

  it('Laboratoires menu should load Laboratoires page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('laboratoires');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Laboratoires').should('exist');
    cy.url().should('match', laboratoiresPageUrlPattern);
  });

  describe('Laboratoires page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(laboratoiresPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Laboratoires page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/laboratoires/new$'));
        cy.getEntityCreateUpdateHeading('Laboratoires');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', laboratoiresPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/laboratoires',
          body: laboratoiresSample,
        }).then(({ body }) => {
          laboratoires = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/laboratoires+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [laboratoires],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(laboratoiresPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Laboratoires page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('laboratoires');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', laboratoiresPageUrlPattern);
      });

      it('edit button click should load edit Laboratoires page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Laboratoires');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', laboratoiresPageUrlPattern);
      });

      it('last delete button click should delete instance of Laboratoires', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('laboratoires').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', laboratoiresPageUrlPattern);

        laboratoires = undefined;
      });
    });
  });

  describe('new Laboratoires page', () => {
    beforeEach(() => {
      cy.visit(`${laboratoiresPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Laboratoires');
    });

    it('should create an instance of Laboratoires', () => {
      cy.get(`[data-cy="nomLaboratoire"]`).type('silver Rivoli COM').should('have.value', 'silver Rivoli COM');

      cy.get(`[data-cy="observationsExamens"]`).type('back-end Borders').should('have.value', 'back-end Borders');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        laboratoires = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', laboratoiresPageUrlPattern);
    });
  });
});
