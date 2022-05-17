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

describe('CategorieChambres e2e test', () => {
  const categorieChambresPageUrl = '/categorie-chambres';
  const categorieChambresPageUrlPattern = new RegExp('/categorie-chambres(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const categorieChambresSample = {};

  let categorieChambres: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/categorie-chambres+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/categorie-chambres').as('postEntityRequest');
    cy.intercept('DELETE', '/api/categorie-chambres/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (categorieChambres) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/categorie-chambres/${categorieChambres.id}`,
      }).then(() => {
        categorieChambres = undefined;
      });
    }
  });

  it('CategorieChambres menu should load CategorieChambres page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('categorie-chambres');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('CategorieChambres').should('exist');
    cy.url().should('match', categorieChambresPageUrlPattern);
  });

  describe('CategorieChambres page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(categorieChambresPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create CategorieChambres page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/categorie-chambres/new$'));
        cy.getEntityCreateUpdateHeading('CategorieChambres');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', categorieChambresPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/categorie-chambres',
          body: categorieChambresSample,
        }).then(({ body }) => {
          categorieChambres = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/categorie-chambres+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [categorieChambres],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(categorieChambresPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details CategorieChambres page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('categorieChambres');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', categorieChambresPageUrlPattern);
      });

      it('edit button click should load edit CategorieChambres page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('CategorieChambres');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', categorieChambresPageUrlPattern);
      });

      it('last delete button click should delete instance of CategorieChambres', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('categorieChambres').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', categorieChambresPageUrlPattern);

        categorieChambres = undefined;
      });
    });
  });

  describe('new CategorieChambres page', () => {
    beforeEach(() => {
      cy.visit(`${categorieChambresPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('CategorieChambres');
    });

    it('should create an instance of CategorieChambres', () => {
      cy.get(`[data-cy="libelleCategory"]`).type('redundant Jordan Technicien').should('have.value', 'redundant Jordan Technicien');

      cy.get(`[data-cy="descriptionChambre"]`).type('Money Sleek').should('have.value', 'Money Sleek');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        categorieChambres = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', categorieChambresPageUrlPattern);
    });
  });
});
