describe('Bloglist app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      username: 'testingfromcypress',
      password: 'supersecurepassword',
      name: 'Test Cypress',
    };
    cy.request('POST', 'http://localhost:3003/api/users', user);
    cy.visit('http://localhost:3000');
  });

  it('Login is shown', function () {
    cy.contains('Log in to application');
    cy.contains('username');
    cy.contains('password');
  });

  describe('Login', function () {
    it('Succeeds with correct credentials', function () {
      cy.get('#username').type('testingfromcypress');
      cy.get('#password').type('supersecurepassword');
      cy.get('#login-button').click();
      cy.get('.success').contains('Login successful');
    });

    it('Fails with wrong credentials', function () {
      cy.get('#username').type('testingfromcypess');
      cy.get('#password').type('wrongpassword');
      cy.get('#login-button').click();
      cy.get('.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'testingfromcypress', password: 'supersecurepassword' });
    });

    it('A blog can be created', function () {
      cy.get('#create-blog').click();
      cy.get('#title').type('Title about Cypress');
      cy.get('#author').type('Cypress');
      cy.get('#url').type('https://www.cypress.io/');
      cy.get('#create-button').click();
      cy.get('.success').should('have.css', 'color', 'rgb(0, 128, 0)');
      cy.contains('Title about Cypress');
    });

    it('Users can like a blog', function () {
      cy.createBlog({
        title: 'Title about Cypress',
        author: 'Cypress',
        url: 'https://www.cypress.io/',
      });
      cy.contains('view').click();
      cy.contains('likes 0');
      cy.contains('like').click()
        .then(() => {
          cy.contains('likes 1');
        });
    });

    it('User who create a blog can delete it', function () {
      cy.createBlog({
        title: 'Title about Cypress',
        author: 'Cypress',
        url: 'https://www.cypress.io/',
      });
      cy.contains('view').click();
      cy.contains('remove').click();
      cy.get('.success').should('have.css', 'color', 'rgb(0, 128, 0)');
      cy.get('.blog').should('not.exist');
    });

    it('Other users cannot delete the blog', function () {
      const user = {
        username: 'testingfromcypress2',
        password: 'supersecurepassword2',
        name: 'Test Cypress 2',
      };
      cy.request('POST', 'http://localhost:3003/api/users', user);

      cy.createBlog({
        title: 'Title about Cypress',
        author: 'Cypress',
        url: 'https://www.cypress.io/',
      });

      cy.contains('logout').click();
      cy.login({ username: 'testingfromcypress2', password: 'supersecurepassword2' });
      cy.contains('view').click();
      cy.contains('remove').should('not.exist');
    });

    it('Blogs are ordered according to likes (most likes being first)', function () {
      cy.createBlog({
        title: 'Most likes at the end',
        author: 'some author',
        url: 'example.com',
      });
      cy.createBlog({
        title: 'Most likes at the beginning',
        author: 'some author 2',
        url: 'example.com',
        likes: 2,
      });
      cy.get('.blog').eq(0).should('contain', 'Most likes at the beginning');
      cy.get('.blog').eq(1).should('contain', 'Most likes at the end');

      cy.get('.showData')
        .then((buttons) => {
          cy.wrap(buttons[1]).click();
        });

      cy.get('.like-button').click();
      cy.wait(500);
      cy.get('.like-button').click();
      cy.wait(500);
      cy.get('.like-button').click();
      cy.wait(500);

      cy.get('.blog').eq(0).should('contain', 'Most likes at the end');
      cy.get('.blog').eq(1).should('contain', 'Most likes at the beginning');
    });
  });
});