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

describe('LigneOrdonnances e2e test', () => {
  const ligneOrdonnancesPageUrl = '/ligne-ordonnances';
  const ligneOrdonnancesPageUrlPattern = new RegExp('/ligne-ordonnances(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const ligneOrdonnancesSample = {};

  let ligneOrdonnances: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/ligne-ordonnances+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/ligne-ordonnances').as('postEntityRequest');
    cy.intercept('DELETE', '/api/ligne-ordonnances/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (ligneOrdonnances) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/ligne-ordonnances/${ligneOrdonnances.id}`,
      }).then(() => {
        ligneOrdonnances = undefined;
      });
    }
  });

  it('LigneOrdonnances menu should load LigneOrdonnances page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('ligne-ordonnances');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('LigneOrdonnances').should('exist');
    cy.url().should('match', ligneOrdonnancesPageUrlPattern);
  });

  describe('LigneOrdonnances page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(ligneOrdonnancesPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create LigneOrdonnances page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/ligne-ordonnances/new$'));
        cy.getEntityCreateUpdateHeading('LigneOrdonnances');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', ligneOrdonnancesPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/ligne-ordonnances',
          body: ligneOrdonnancesSample,
        }).then(({ body }) => {
          ligneOrdonnances = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/ligne-ordonnances+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [ligneOrdonnances],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(ligneOrdonnancesPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details LigneOrdonnances page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('ligneOrdonnances');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', ligneOrdonnancesPageUrlPattern);
      });

      it('edit button click should load edit LigneOrdonnances page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('LigneOrdonnances');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', ligneOrdonnancesPageUrlPattern);
      });

      it('last delete button click should delete instance of LigneOrdonnances', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('ligneOrdonnances').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', ligneOrdonnancesPageUrlPattern);

        ligneOrdonnances = undefined;
      });
    });
  });

  describe('new LigneOrdonnances page', () => {
    beforeEach(() => {
      cy.visit(`${ligneOrdonnancesPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('LigneOrdonnances');
    });

    it('should create an instance of LigneOrdonnances', () => {
      cy.get(`[data-cy="medicament"]`).type('Concrete').should('have.value', 'Concrete');

      cy.get(`[data-cy="posologie"]`).type('Frozen Sleek').should('have.value', 'Frozen Sleek');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        ligneOrdonnances = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', ligneOrdonnancesPageUrlPattern);
    });
  });
});
