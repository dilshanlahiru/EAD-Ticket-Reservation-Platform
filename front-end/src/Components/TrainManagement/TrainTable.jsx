import React from "react";
import "../custom.css";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import TrainService from "../Service/TrainService";
import Swal from "sweetalert2";

const TrainTable = () => {
  const [search, setSearch] = useState("");
  const [trainList, setTrainList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    TrainService.getAllTrains().then((data) => {
      setTrainList(data);
      console.log(data);
    });
  }, []);

  const deleteTrain = (trainId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          TrainService.deleteTrain(trainId)
            .then((res) => {
              setTrainList(
                trainList.filter((trainList) => trainList.id !== trainId)
              );
            })
            .catch((error) => {
              console.log(error);
            });

          swalWithBootstrapButtons.fire(
            "Deleted!",
            "Your file has been deleted.",
            "success"
          );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Delete canceled",
            "error"
          );
        }
      });
  };

  return (
    <div>
      <div>
        <img
          style={{ height: "300px" }}
          src="https://www.atpi.com/media/cache/picture/35a05bdfc8e6aa40d1c9798e355cefdb.webp"
          alt="Hero Image"
          className="img-fluid w-100"
        />
      </div>
      <div className="centered-text">
        <h1>Train Sceduals</h1>
      </div>

      <div className="p-3">
        <div className=" boxnotice  text-center p-3 mt-1">
          <div>
            <div className="container p-1 mt-4 mb-4">
              <div className="row ">
                <div className="shadow-lg card mx-auto w-100">
                  <div className=" container d-flex flex-row">
                    <input
                      type="text"
                      placeholder="Search By Train Name"
                      className="form-control mt-3 w-50 mx-2"
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                    />

                    <Link
                      className="btn btn-primary mt-3 p-2"
                      style={{ width: 190, marginLeft: 460 }}
                      to={"/trainForm"}
                    >
                      Add Train &nbsp;
                      <i class="fa fa-plus-circle" aria-hidden="true"></i>
                    </Link>
                  </div>
                  <table class="table table-striped mt-3">
                    <thead className="table-primary">
                      <tr>
                        <th scope="col">Train Name</th>
                        <th scope="col">Note</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainList
                        ?.filter((value) => {
                          if (search === "") {
                            return value;
                          } else if (
                            //value.id.toString(includes(search))
                            value.trainName
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          ) {
                            return value;
                          }
                          return 0;
                        })
                        .map((t) => (
                          <tr key={t.id}>
                            <td>{t.trainName}</td>
                            <td>{t.note}</td>
                            <td className="d-flex justify-content-around">
                              <Link
                                className="btn btn-primary"
                                to={`/scheduleTable/${t.id}`}
                              >
                                Schedules
                              </Link>

                              <Link
                                className="btn btn-warning"
                                to={`/trainForm/${t.id}`}
                              >
                                Update
                              </Link>

                              <button
                                type="button"
                                onClick={() => deleteTrain(t.id)}
                                class="btn btn-danger"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <br></br>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainTable;
