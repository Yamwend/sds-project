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

describe('Examens e2e test', () => {
  const examensPageUrl = '/examens';
  const examensPageUrlPattern = new RegExp('/examens(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const examensSample = {};

  let examens: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/examens+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/examens').as('postEntityRequest');
    cy.intercept('DELETE', '/api/examens/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (examens) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/examens/${examens.id}`,
      }).then(() => {
        examens = undefined;
      });
    }
  });

  it('Examens menu should load Examens page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('examens');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Examens').should('exist');
    cy.url().should('match', examensPageUrlPattern);
  });

  describe('Examens page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(examensPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Examens page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/examens/new$'));
        cy.getEntityCreateUpdateHeading('Examens');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', examensPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/examens',
          body: examensSample,
        }).then(({ body }) => {
          examens = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/examens+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [examens],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(examensPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Examens page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('examens');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', examensPageUrlPattern);
      });

      it('edit button click should load edit Examens page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Examens');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', examensPageUrlPattern);
      });

      it('last delete button click should delete instance of Examens', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('examens').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', examensPageUrlPattern);

        examens = undefined;
      });
    });
  });

  describe('new Examens page', () => {
    beforeEach(() => {
      cy.visit(`${examensPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Examens');
    });

    it('should create an instance of Examens', () => {
      cy.get(`[data-cy="nomExamen"]`).type('fuchsia Wooden').should('have.value', 'fuchsia Wooden');

      cy.get(`[data-cy="typeExamen"]`).type('Persistent Bedfordshire Movies').should('have.value', 'Persistent Bedfordshire Movies');

      cy.get(`[data-cy="dateExamen"]`).type('2022-05-16T21:00').should('have.value', '2022-05-16T21:00');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        examens = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', examensPageUrlPattern);
    });
  });
});
