//IMPORTS
import { registrationModel } from "./registration.js";
import { ProjectModel } from "../project/project.js"
//RESOLVER{

const registrationResolvers = {
  // Registration: {
  //   proyecto: async (parent, args) => {
  //     return ProjectModel.find({ nombre: parent.Project })
  //   },
  // },
  //  DEFINICION DE QUERY
  Query: {
    //FALTA TRAER NOMBRE DE PROYECTOS
    Registrations: async (parent, args) => {
      const registrations = await registrationModel.find().populate('proyecto');
      return registrations;
    },
    inscripcionesConProyectoYEstudiante: async (parent, args) => {
      const inscripcionesConProyectoYEstudiante = await registrationModel.find(
        // {
        //   estado: 'ACEPTADA'
        // }
      ).populate('estudiante').populate('proyecto');
      return inscripcionesConProyectoYEstudiante;
    },
  },
  //  DEFINICIÓN DE MUTACIONES
  Mutation: {
    createRegistration: async (parent, args) => {
      const registrationCreated = await registrationModel.create({
        // estado: args.estado,
        proyecto: args.proyecto,
        estudiante: args.estudiante,
      });
      return registrationCreated;
    },
    approveRegistration: async (parent, args) => {
      if (args.estado === 'ACEPTADA') {
        const fecha = new Date()
        const registrationApproved = await registrationModel.findByIdAndUpdate(
          args._id,
          {
            estado: args.estado,
            fechaIngreso: fecha.toISOString().split('T')[0]
          },
          { new: true }
        );
        return registrationApproved;
      }
    },
    //FECHA DE EGRESO CUANDO UN PROYECTO ESTA EN FASE DE TERMINADO, ADICIONAL 
    // updateEndDateRegistration: async (parent, args) => {
    //   const updatedEndDateRegistration = await ProjectModel.findOne(
    //     args.fase,
    //     {
    //       fase: "TERMINADO",
    //       fechaEgreso: Date.now(),
    //     },

    //     { new: true }
    //   );
    //   return updatedEndDateRegistration;
    // },
  },
};

//EXPORT
export { registrationResolvers };
