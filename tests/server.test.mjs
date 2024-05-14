import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js'; // Переконайтесь, що шлях правильний

const should = chai.should();

chai.use(chaiHttp);

describe('API Routes', () => {
  it('should GET the root route', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.equal('Get root route');
        done();
      });
  });
  
  it('should GET users route', (done) => {
    chai.request(app)
      .get('/users')
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.equal('Get users route');
        done();
      });
  });
  
  it('should POST users route', (done) => {
    chai.request(app)
      .post('/users')
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.equal('Post users route');
        done();
      });
  });
  
  it('should GET user by Id route', (done) => {
    const userId = 1;
    chai.request(app)
      .get(`/users/${userId}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.equal(`Get user by Id route: ${userId}`);
        done();
      });
  });
  
  it('should PUT user by Id route', (done) => {
    const userId = 1;
    chai.request(app)
      .put(`/users/${userId}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.equal(`Put user by Id route: ${userId}`);
        done();
      });
  });
  
  it('should DELETE user by Id route', (done) => {
    const userId = 1;
    chai.request(app)
      .delete(`/users/${userId}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.equal(`Delete user by Id route: ${userId}`);
        done();
      });
  });
  
  // Додайте аналогічні тести для маршрутів /articles
});
