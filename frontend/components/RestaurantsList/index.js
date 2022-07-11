import Link from 'next/link';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Card, CardBody, CardImg, CardTitle, Col, Row } from 'reactstrap';

const query = gql`
  {
    restaurants {
      id
      name
      description
      image {
        url
      }
    }
  }
`;

const RestaurantList = ({ search }) => {
  const { loading, error, data } = useQuery(query);

  if (error) return <h1>レストランの読み込みに失敗しました</h1>;

  if (loading) return <h1>読み込み中...</h1>;

  if (data) {
    const searchQuery = data.restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(search)
    );

    return (
      <Row>
        {searchQuery.map((restaurant) => (
          <Col key={restaurant.id} xs="6" sm="4">
            <Card style={{ margin: '0 0.5rem 20px 0.5rem' }}>
              <CardImg
                src={`${process.env.NEXT_PUBLIC_API_URL}${restaurant.image[0].url}`}
                top={true}
                style={{ height: 250 }}
              />
              <CardBody>
                <CardTitle>{restaurant.name}</CardTitle>
                <CardTitle>{restaurant.description}</CardTitle>
              </CardBody>
              <div className="card-footer">
                <Link
                  href={`/restaurants?id=${restaurant.id}`}
                  as={`/restaurants/${restaurant.id}`}
                >
                  <a className="btn btn-primary">もっと見る</a>
                </Link>
              </div>
            </Card>
          </Col>
        ))}
        <style jsx>{`
          a {
            color: white;
          }
          a:link {
            text-decoration: none;
            color: white;
          }
          a:hover {
            color: white;
          }
          .card-colums {
            column-count: 3;
          }
        `}</style>
      </Row>
    );
  } else {
    return <h1>レストランが見つかりませんでした</h1>;
  }
};

export default RestaurantList;
