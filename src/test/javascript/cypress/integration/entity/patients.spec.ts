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

describe('Patients e2e test', () => {
  const patientsPageUrl = '/patients';
  const patientsPageUrlPattern = new RegExp('/patients(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const patientsSample = {};

  let patients: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/patients+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/patients').as('postEntityRequest');
    cy.intercept('DELETE', '/api/patients/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (patients) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/patients/${patients.id}`,
      }).then(() => {
        patients = undefined;
      });
    }
  });

  it('Patients menu should load Patients page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('patients');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Patients').should('exist');
    cy.url().should('match', patientsPageUrlPattern);
  });

  describe('Patients page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(patientsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Patients page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/patients/new$'));
        cy.getEntityCreateUpdateHeading('Patients');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', patientsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/patients',
          body: patientsSample,
        }).then(({ body }) => {
          patients = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/patients+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [patients],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(patientsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Patients page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('patients');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', patientsPageUrlPattern);
      });

      it('edit button click should load edit Patients page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Patients');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', patientsPageUrlPattern);
      });

      it('last delete button click should delete instance of Patients', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('patients').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', patientsPageUrlPattern);

        patients = undefined;
      });
    });
  });

  describe('new Patients page', () => {
    beforeEach(() => {
      cy.visit(`${patientsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Patients');
    });

    it('should create an instance of Patients', () => {
      cy.get(`[data-cy="codePat"]`).type('b bandwidth').should('have.value', 'b bandwidth');

      cy.get(`[data-cy="nomPat"]`).type('Lettonie').should('have.value', 'Lettonie');

      cy.get(`[data-cy="prenomPat"]`).type('Managed convergence Metal').should('have.value', 'Managed convergence Metal');

      cy.get(`[data-cy="sexePat"]`).select('MASCULIN');

      cy.get(`[data-cy="adressePat"]`).type('Cambridgeshire human-resource').should('have.value', 'Cambridgeshire human-resource');

      cy.get(`[data-cy="telephonePat"]`).type('enhance invoice').should('have.value', 'enhance invoice');

      cy.get(`[data-cy="emailPat"]`).type('Concrete').should('have.value', 'Concrete');

      cy.get(`[data-cy="originePat"]`).type('c enterprise').should('have.value', 'c enterprise');

      cy.get(`[data-cy="professionPat"]`).type('one-to-one b functionalities').should('have.value', 'one-to-one b functionalities');

      cy.get(`[data-cy="agePat"]`).type('2022-05-16T21:37').should('have.value', '2022-05-16T21:37');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        patients = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', patientsPageUrlPattern);
    });
  });
});
