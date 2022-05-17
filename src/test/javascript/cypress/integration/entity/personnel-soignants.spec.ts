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

describe('PersonnelSoignants e2e test', () => {
  const personnelSoignantsPageUrl = '/personnel-soignants';
  const personnelSoignantsPageUrlPattern = new RegExp('/personnel-soignants(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const personnelSoignantsSample = {};

  let personnelSoignants: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/personnel-soignants+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/personnel-soignants').as('postEntityRequest');
    cy.intercept('DELETE', '/api/personnel-soignants/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (personnelSoignants) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/personnel-soignants/${personnelSoignants.id}`,
      }).then(() => {
        personnelSoignants = undefined;
      });
    }
  });

  it('PersonnelSoignants menu should load PersonnelSoignants page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('personnel-soignants');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('PersonnelSoignants').should('exist');
    cy.url().should('match', personnelSoignantsPageUrlPattern);
  });

  describe('PersonnelSoignants page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(personnelSoignantsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create PersonnelSoignants page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/personnel-soignants/new$'));
        cy.getEntityCreateUpdateHeading('PersonnelSoignants');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', personnelSoignantsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/personnel-soignants',
          body: personnelSoignantsSample,
        }).then(({ body }) => {
          personnelSoignants = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/personnel-soignants+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [personnelSoignants],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(personnelSoignantsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details PersonnelSoignants page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('personnelSoignants');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', personnelSoignantsPageUrlPattern);
      });

      it('edit button click should load edit PersonnelSoignants page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PersonnelSoignants');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', personnelSoignantsPageUrlPattern);
      });

      it('last delete button click should delete instance of PersonnelSoignants', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('personnelSoignants').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', personnelSoignantsPageUrlPattern);

        personnelSoignants = undefined;
      });
    });
  });

  describe('new PersonnelSoignants page', () => {
    beforeEach(() => {
      cy.visit(`${personnelSoignantsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('PersonnelSoignants');
    });

    it('should create an instance of PersonnelSoignants', () => {
      cy.get(`[data-cy="codePersonne"]`).type('deposit Won Pays-Bas').should('have.value', 'deposit Won Pays-Bas');

      cy.get(`[data-cy="nomPersonne"]`).type('a bandwidth').should('have.value', 'a bandwidth');

      cy.get(`[data-cy="prenomPersonne"]`).type('Loan Ergonomic').should('have.value', 'Loan Ergonomic');

      cy.get(`[data-cy="gradePersonne"]`).select('GENERALISTE');

      cy.get(`[data-cy="fonctionPersonne"]`)
        .type('open-source Ergonomic Île-de-France')
        .should('have.value', 'open-source Ergonomic Île-de-France');

      cy.get(`[data-cy="telphonePersonne"]`).type('mobile Rhône-Alpes').should('have.value', 'mobile Rhône-Alpes');

      cy.get(`[data-cy="emailPersonne"]`).select('FEMININ');

      cy.get(`[data-cy="adressePersonne"]`).type('killer').should('have.value', 'killer');

      cy.get(`[data-cy="dateDeNaissPersonne"]`).type('2022-05-17T01:32').should('have.value', '2022-05-17T01:32');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        personnelSoignants = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', personnelSoignantsPageUrlPattern);
    });
  });
});
