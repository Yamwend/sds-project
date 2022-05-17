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

describe('Traitements e2e test', () => {
  const traitementsPageUrl = '/traitements';
  const traitementsPageUrlPattern = new RegExp('/traitements(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const traitementsSample = {};

  let traitements: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/traitements+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/traitements').as('postEntityRequest');
    cy.intercept('DELETE', '/api/traitements/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (traitements) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/traitements/${traitements.id}`,
      }).then(() => {
        traitements = undefined;
      });
    }
  });

  it('Traitements menu should load Traitements page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('traitements');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Traitements').should('exist');
    cy.url().should('match', traitementsPageUrlPattern);
  });

  describe('Traitements page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(traitementsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Traitements page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/traitements/new$'));
        cy.getEntityCreateUpdateHeading('Traitements');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', traitementsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/traitements',
          body: traitementsSample,
        }).then(({ body }) => {
          traitements = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/traitements+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [traitements],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(traitementsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Traitements page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('traitements');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', traitementsPageUrlPattern);
      });

      it('edit button click should load edit Traitements page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Traitements');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', traitementsPageUrlPattern);
      });

      it('last delete button click should delete instance of Traitements', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('traitements').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', traitementsPageUrlPattern);

        traitements = undefined;
      });
    });
  });

  describe('new Traitements page', () => {
    beforeEach(() => {
      cy.visit(`${traitementsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Traitements');
    });

    it('should create an instance of Traitements', () => {
      cy.get(`[data-cy="observationsTraitement"]`).type('web-readiness implement').should('have.value', 'web-readiness implement');

      cy.get(`[data-cy="debutTraitement"]`).type('2022-05-16T18:59').should('have.value', '2022-05-16T18:59');

      cy.get(`[data-cy="finTraitement"]`).type('2022-05-17T03:31').should('have.value', '2022-05-17T03:31');

      cy.get(`[data-cy="etatFinPatient"]`).type('de Savings bandwidth').should('have.value', 'de Savings bandwidth');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        traitements = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', traitementsPageUrlPattern);
    });
  });
});
