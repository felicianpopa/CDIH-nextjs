import Layout from "@/components/Layout";
import { mainConfigurations } from "@/configurations/mainConfigurations";
import RequireAuth from "@/components/RequireAuth";
import DataCard from "@/components/ui/DataCard";

const Home = () => {
  const dashboardCardData = [
    {
      title: "Orders",
      icon: "faCartShopping",
      iconBg: "#CCFBF1",
      iconColor: "#14B8A6",
      value: "1,235",
    },
    {
      title: "Total Revenue",
      icon: "faDollarSign",
      iconBg: "#CCFBF1",
      iconColor: "#14B8A6",
      value: "$3,005,723",
    },
    {
      title: "Average Price",
      icon: "faChartLine",
      iconBg: "#CCFBF1",
      iconColor: "#14B8A6",
      value: "$1,600.2",
    },
  ];

  const dashboardUserData = {
    image: "media/images/user0.jpeg",
    name: "Henry Price",
    qualification: "Sales Rep",
    profileLink: "#",
    additionalData: [
      {
        name: "Projects",
        value: "125",
      },
      {
        name: "Revenue this year",
        value: "$1,000,245",
      },
      {
        name: "Most expensive sale",
        value: "$5,000",
      },
      {
        name: "Clients",
        value: "100",
      },
      {
        name: "Conversion Rate",
        value: "75%",
      },
    ],
  };

  return (
    <RequireAuth allowedRoles={[mainConfigurations.user.roles.user]}>
      <Layout>
        <>
          <div className="dashboard__header card">
            <div className="card-body">
              <h2>Welcome back!</h2>
              <p className="color-secondary">Hub de Case Dashboard</p>

              <div className="row gy-4">
                <div className="dashboard__user-data-info col-12 col-md-4">
                  <div className="dashboard__user-data-info__left">
                    <img
                      src={dashboardUserData.image}
                      alt={dashboardUserData.name}
                    />
                  </div>
                  <div className="dashboard__user-data-info__right">
                    <h4>{dashboardUserData.name}</h4>
                    <p className="color-secondary">
                      {dashboardUserData.qualification}
                    </p>
                    <a
                      href={dashboardUserData.profileLink}
                      className="btn btn-primary"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
                <div className="col-12 col-md-8">
                  <div className="row dashboard__user-data-additional gy-4">
                    {dashboardUserData.additionalData.map((item, index) => (
                      <div
                        key={index}
                        className="dashboard__user-data-additional__item col-6 col-md-3"
                      >
                        <span className="dashboard__user-data-additional__item-value">
                          {item.value}
                        </span>
                        <span className="dashboard__user-data-additional__item-name">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DataCard cardsData={dashboardCardData} />
        </>
      </Layout>
    </RequireAuth>
  );
};

export default Home;
