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

describe('TypeExams e2e test', () => {
  const typeExamsPageUrl = '/type-exams';
  const typeExamsPageUrlPattern = new RegExp('/type-exams(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const typeExamsSample = {};

  let typeExams: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/type-exams+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/type-exams').as('postEntityRequest');
    cy.intercept('DELETE', '/api/type-exams/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (typeExams) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/type-exams/${typeExams.id}`,
      }).then(() => {
        typeExams = undefined;
      });
    }
  });

  it('TypeExams menu should load TypeExams page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('type-exams');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TypeExams').should('exist');
    cy.url().should('match', typeExamsPageUrlPattern);
  });

  describe('TypeExams page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(typeExamsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TypeExams page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/type-exams/new$'));
        cy.getEntityCreateUpdateHeading('TypeExams');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', typeExamsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/type-exams',
          body: typeExamsSample,
        }).then(({ body }) => {
          typeExams = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/type-exams+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [typeExams],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(typeExamsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TypeExams page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('typeExams');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', typeExamsPageUrlPattern);
      });

      it('edit button click should load edit TypeExams page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TypeExams');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', typeExamsPageUrlPattern);
      });

      it('last delete button click should delete instance of TypeExams', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('typeExams').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', typeExamsPageUrlPattern);

        typeExams = undefined;
      });
    });
  });

  describe('new TypeExams page', () => {
    beforeEach(() => {
      cy.visit(`${typeExamsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TypeExams');
    });

    it('should create an instance of TypeExams', () => {
      cy.get(`[data-cy="libelleType"]`).type('Steel Producteur bi-directional').should('have.value', 'Steel Producteur bi-directional');

      cy.get(`[data-cy="descruptionType"]`).type('de architectures c').should('have.value', 'de architectures c');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        typeExams = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', typeExamsPageUrlPattern);
    });
  });
});
