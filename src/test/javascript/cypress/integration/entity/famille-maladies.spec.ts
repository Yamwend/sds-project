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

describe('FamilleMaladies e2e test', () => {
  const familleMaladiesPageUrl = '/famille-maladies';
  const familleMaladiesPageUrlPattern = new RegExp('/famille-maladies(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const familleMaladiesSample = {};

  let familleMaladies: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/famille-maladies+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/famille-maladies').as('postEntityRequest');
    cy.intercept('DELETE', '/api/famille-maladies/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (familleMaladies) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/famille-maladies/${familleMaladies.id}`,
      }).then(() => {
        familleMaladies = undefined;
      });
    }
  });

  it('FamilleMaladies menu should load FamilleMaladies page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('famille-maladies');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('FamilleMaladies').should('exist');
    cy.url().should('match', familleMaladiesPageUrlPattern);
  });

  describe('FamilleMaladies page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(familleMaladiesPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create FamilleMaladies page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/famille-maladies/new$'));
        cy.getEntityCreateUpdateHeading('FamilleMaladies');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', familleMaladiesPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/famille-maladies',
          body: familleMaladiesSample,
        }).then(({ body }) => {
          familleMaladies = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/famille-maladies+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [familleMaladies],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(familleMaladiesPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details FamilleMaladies page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('familleMaladies');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', familleMaladiesPageUrlPattern);
      });

      it('edit button click should load edit FamilleMaladies page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('FamilleMaladies');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', familleMaladiesPageUrlPattern);
      });

      it('last delete button click should delete instance of FamilleMaladies', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('familleMaladies').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', familleMaladiesPageUrlPattern);

        familleMaladies = undefined;
      });
    });
  });

  describe('new FamilleMaladies page', () => {
    beforeEach(() => {
      cy.visit(`${familleMaladiesPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('FamilleMaladies');
    });

    it('should create an instance of FamilleMaladies', () => {
      cy.get(`[data-cy="libelleFMaladie"]`).type('Organized Home').should('have.value', 'Organized Home');

      cy.get(`[data-cy="descriptionFMaladie"]`)
        .type('Bretagne deliverables fresh-thinking')
        .should('have.value', 'Bretagne deliverables fresh-thinking');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        familleMaladies = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', familleMaladiesPageUrlPattern);
    });
  });
});
