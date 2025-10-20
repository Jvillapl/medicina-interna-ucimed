import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";

import { Toaster, toast } from "sonner";
import { Calendar, Mail, Newspaper, GraduationCap, ShieldCheck, ExternalLink, Instagram, BookOpen, FileText, Send, Stethoscope } from "lucide-react";

// Importar funciones de Supabase
import { submitArticle, getSubmissionStats } from './lib/supabase.js';

// ------- Utilidades simples ---------
const cls = (...c) => c.filter(Boolean).join(" ");
const todayISO = () => new Date().toISOString().slice(0,10);

// ------- Datos de ejemplo (puedes reemplazar) ---------
const DEMO_POSTS = [
  {
    id: "1",
    title: "Diferencia entre hipertiroidismo y tirotoxicosis",
    summary: "Revisión breve de fisiopatología, causas y manejo inicial en urgencias.",
    tags: ["Endocrino", "Urgencias"],
    cover: "https://placehold.co/800x500/png?text=Hipertiroidismo",
    date: "2025-10-18",
    author: "Grupo de Interés Medicina Interna UCIMED",
    link: "#",
  },
  {
    id: "2",
    title: "Escala KDIGO para lesión renal aguda (LRA)",
    summary: "Cómo aplicar la clasificación KDIGO en la práctica clínica del internista.",
    tags: ["Nefrología"],
    cover: "https://placehold.co/800x500/png?text=KDIGO",
    date: "2025-10-17",
    author: "Equipo Nefro UCIMED",
    link: "#",
  },
  {
    id: "3",
    title: "Clasificación Child-Pugh: perlas para el examen físico y cálculo",
    summary: "Recordatorio práctico para rotaciones de gastro y emergencias.",
    tags: ["Gastro", "Hepatología"],
    cover: "https://placehold.co/800x500/png?text=Child-Pugh",
    date: "2025-10-12",
    author: "Comité Académico",
    link: "#",
  },
];

const DEMO_EVENTS = [
  { date: "2025-10-25", title: "Voluntariado – Feria de Salud", place: "El Huazo, Desamparados", details: "Actividad comunitaria con toma de signos, educación y referencia." },
  { date: "2025-11-08", title: "Club de Artículos: Insuficiencia Cardiaca 2023-24", place: "UCIMED – Aula 203", details: "Discusión de guías y ensayo EMPEROR-Preserved." },
];

const TAGS = [
  "Todos", "Cardio", "Nefrología", "Endocrino", "Infectología", "Neumo", "Reumatología", "Gastro", "Hepatología", "Urgencias"
];

// ------- Almacenamiento de envíos en localStorage ---------
const STORAGE_KEY = "ucimed_mi_submissions_v1";
const saveSubmission = (s) => {
  const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const next = [s, ...prev];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};
const readSubmissions = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

// ------- Componentes UI ---------
function Navbar(){
  return (
    <div className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 grid place-items-center shadow-lg pulse-glow">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">Medicina Interna UCIMED</div>
            <div className="text-xs text-slate-500 font-medium">Grupo de Interés – Estudiantes</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1">
          <a href="#publicaciones" className="px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-300 text-slate-700 font-medium">Publicaciones</a>
          <a href="#eventos" className="px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-300 text-slate-700 font-medium">Eventos</a>
          <a href="#equipo" className="px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-300 text-slate-700 font-medium">Equipo</a>
          <a href="#enviar" className="px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-300 text-slate-700 font-medium">Enviar artículo</a>
          <a className="px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-300 inline-flex items-center gap-2 text-slate-700 font-medium" href="https://instagram.com/medicina_interna_ucimed" target="_blank" rel="noreferrer">
            <Instagram className="w-4 h-4"/> Instagram
          </a>
        </div>
      </div>
    </div>
  );
}

function Hero(){
  return (
    <div className="gradient-hero relative overflow-hidden">
      {/* Elementos de fondo decorativos */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-cyan-100/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 relative z-10">
        <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:0.8}} className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.8, delay:0.2}}
              className="text-5xl md:text-6xl font-bold leading-tight"
            >
              Conocimiento clínico hecho por estudiantes, para estudiantes.
            </motion.h1>
            <motion.p 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.8, delay:0.4}}
              className="mt-6 text-xl text-slate-600 leading-relaxed"
            >
              Resúmenes de temas clave, infografías, guías rápidas y clubes de artículos
              del <strong className="text-blue-700">Grupo de Interés en Medicina Interna UCIMED</strong>.
            </motion.p>
            <motion.div 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.8, delay:0.6}}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <a href="#publicaciones"><Button size="lg" className="text-lg px-8 py-4">Ver publicaciones</Button></a>
              <a href="#enviar"><Button size="lg" variant="outline" className="text-lg px-8 py-4">Proponer artículo</Button></a>
            </motion.div>
            <motion.div 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.8, delay:0.8}}
              className="mt-8 flex flex-col sm:flex-row gap-6 text-sm text-slate-600"
            >
              <span className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <ShieldCheck className="w-5 h-5 text-blue-600"/> Revisión por pares estudiantil
              </span>
              <span className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <GraduationCap className="w-5 h-5 text-blue-600"/> Enfoque docente
              </span>
            </motion.div>
          </div>
          <motion.div
            initial={{opacity:0, x:30}} 
            animate={{opacity:1, x:0}} 
            transition={{duration:0.8, delay:0.4}}
            className="float-animation"
          >
            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><Newspaper className="w-6 h-6 text-blue-600"/> Lo más reciente</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {DEMO_POSTS.slice(0,2).map(p => (
                  <a key={p.id} href="#publicaciones" className="p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-blue-50/30">
                    <div className="text-sm text-slate-500 font-medium">{new Date(p.date).toLocaleDateString()}</div>
                    <div className="font-bold mt-2 text-slate-800 leading-snug">{p.title}</div>
                    <div className="text-sm text-slate-600 line-clamp-2 mt-1">{p.summary}</div>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {p.tags.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function PublicacionCard({ p }){
  return (
    <Card className="overflow-hidden h-full flex flex-col group">
      <div className="relative overflow-hidden">
        <img 
          src={p.cover} 
          alt={p.title} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <CardContent className="p-6 flex flex-col gap-4 flex-1">
        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">
          {new Date(p.date).toLocaleDateString()} · {p.author}
        </div>
        <div className="font-bold text-xl leading-snug text-slate-800 group-hover:text-blue-700 transition-colors duration-300">
          {p.title}
        </div>
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {p.summary}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {p.tags.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
          </div>
          <Button variant="ghost" size="sm" asChild>
            <a href={p.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
              Leer <ExternalLink className="w-4 h-4"/>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Publicaciones(){
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("Todos");

  const filtered = useMemo(() => {
    return DEMO_POSTS.filter(p =>
      (tag === "Todos" || p.tags.includes(tag)) &&
      (p.title.toLowerCase().includes(query.toLowerCase()) || p.summary.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, tag]);

  return (
    <div className="py-8">
      <motion.div 
        initial={{opacity:0, y:30}} 
        whileInView={{opacity:1, y:0}} 
        transition={{duration:0.6}}
        viewport={{once: true}}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12"
      >
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
            Publicaciones
          </h2>
          <p className="text-slate-600 text-lg mt-2">Infografías, resúmenes y guías creadas por el grupo.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <Input 
            placeholder="Buscar publicaciones..." 
            className="min-w-[250px]" 
            value={query} 
            onChange={(e)=>setQuery(e.target.value)} 
          />
          <Select value={tag} onValueChange={setTag}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por área"/>
            </SelectTrigger>
            <SelectContent>
              {TAGS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div 
        initial={{opacity:0, y:30}} 
        whileInView={{opacity:1, y:0}} 
        transition={{duration:0.6, delay:0.2}}
        viewport={{once: true}}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filtered.map((p, index) => (
          <motion.div
            key={p.id}
            initial={{opacity:0, y:30}} 
            whileInView={{opacity:1, y:0}} 
            transition={{duration:0.6, delay: index * 0.1}}
            viewport={{once: true}}
          >
            <PublicacionCard p={p} />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16">
            <div className="text-slate-400 text-lg">No hay resultados con ese filtro.</div>
            <p className="text-slate-500 text-sm mt-2">Intenta con otros términos de búsqueda o área.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function Eventos(){
  return (
    <div className="py-8 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-3xl">
      <motion.div
        initial={{opacity:0, y:30}} 
        whileInView={{opacity:1, y:0}} 
        transition={{duration:0.6}}
        viewport={{once: true}}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <h2 className="text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
            <Calendar className="w-8 h-8 text-blue-600"/> Eventos
          </h2>
          <Badge variant="secondary" className="text-sm px-4 py-2 mt-4 sm:mt-0">
            {new Date().toLocaleDateString()}
          </Badge>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {DEMO_EVENTS.map((ev, idx) => (
            <motion.div
              key={idx}
              initial={{opacity:0, y:30}} 
              whileInView={{opacity:1, y:0}} 
              transition={{duration:0.6, delay: idx * 0.2}}
              viewport={{once: true}}
            >
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-cyan-500"></div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl pl-4">{ev.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 pl-10">
                  <div className="font-semibold text-blue-700 mb-2">
                    📅 {new Date(ev.date).toLocaleDateString()} · 📍 {ev.place}
                  </div>
                  <div className="leading-relaxed">{ev.details}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function Equipo(){
  const members = [
    { name: "Luis Bonilla", role: "Coordinador", social: "@luisboncr", color: "from-blue-500 to-blue-600" },
    { name: "Julia", role: "Subcoordinadora", social: "@julia9134", color: "from-purple-500 to-pink-500" },
    { name: "Sofía", role: "Redes", social: "@_sofiabarrantes", color: "from-emerald-500 to-cyan-500" },
    { name: "Jose Villaplana", role: "Developer", social: "@jose_villa_0299", color: "from-orange-500 to-red-500" },
  ];
  
  return (
    <div className="py-8">
      <motion.div
        initial={{opacity:0, y:30}} 
        whileInView={{opacity:1, y:0}} 
        transition={{duration:0.6}}
        viewport={{once: true}}
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4">
          Equipo
        </h2>
        <p className="text-slate-600 text-lg mb-12">Conoce a las personas detrás del grupo de interés.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((m, i) => (
            <motion.div
              key={i}
              initial={{opacity:0, y:30}} 
              whileInView={{opacity:1, y:0}} 
              transition={{duration:0.6, delay: i * 0.15}}
              viewport={{once: true}}
            >
              <Card className="text-center group hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${m.color} grid place-items-center text-xl font-bold text-white shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {m.name.split(' ').map(n => n.charAt(0)).join('')}
                  </div>
                  <div className="font-bold text-lg text-slate-800 mb-1 leading-tight">{m.name}</div>
                  <div className="text-blue-600 font-semibold mb-2 text-sm">{m.role}</div>
                  <div className="text-xs text-slate-500">{m.social}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function FormEnviar(){
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    authors: "",
    summary: "",
    keywords: "",
    doi: "",
    pdf: "",
    area: "Cardio",
    ethics: false,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if(!form.title || !form.authors || !form.summary){
      toast.error("Completa título, autores y resumen");
      return;
    }
    if(!form.ethics) {
      toast.error("Debes aceptar la declaración ética");
      return;
    }
    
    setLoading(true);
    
    try {
      // Enviar a Supabase
      const result = await submitArticle(form);
      
      if (result.success) {
        toast.success("¡Artículo enviado exitosamente! 🎉\nRecibirás confirmación por email.");
        setForm({ title:"", authors:"", summary:"", keywords:"", doi:"", pdf:"", area:"Cardio", ethics:false });
        
        // También guardar localmente como respaldo
        const submission = { ...form, id: crypto.randomUUID(), date: new Date().toISOString() };
        saveSubmission(submission);
      } else {
        toast.error(`Error al enviar: ${result.error}`);
        // Si falla Supabase, guardar localmente
        const submission = { ...form, id: crypto.randomUUID(), date: new Date().toISOString() };
        saveSubmission(submission);
        toast.info("Guardado localmente como respaldo");
      }
    } catch (error) {
      toast.error("Error de conexión. Intenta nuevamente.");
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="enviar" className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold flex items-center gap-2"><BookOpen className="w-6 h-6"/> Proponer artículo científico</h2>
      <p className="text-muted-foreground mt-1">Para clubes de artículos, reseñas o entradas de blog académico. Los envíos se almacenan en nuestra base de datos y el equipo los revisará en breve.</p>

      <form onSubmit={onSubmit} className="grid gap-4 mt-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input className="rounded-2xl" value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
          </div>
          <div>
            <label className="text-sm font-medium">Autores</label>
            <Input className="rounded-2xl" placeholder="Apellido A, Apellido B" value={form.authors} onChange={e=>setForm({...form, authors:e.target.value})}/>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Resumen (máx. 1200 caracteres)</label>
          <Textarea className="rounded-2xl min-h-[120px]" value={form.summary} onChange={e=>setForm({...form, summary:e.target.value})}/>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Palabras clave</label>
            <Input className="rounded-2xl" placeholder="coma, separadas" value={form.keywords} onChange={e=>setForm({...form, keywords:e.target.value})}/>
          </div>
          <div>
            <label className="text-sm font-medium">Área</label>
            <Select value={form.area} onValueChange={(v)=>setForm({...form, area:v})}>
              <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TAGS.filter(t=>t!=="Todos").map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">DOI / enlace</label>
            <Input className="rounded-2xl" placeholder="https://doi.org/..." value={form.doi} onChange={e=>setForm({...form, doi:e.target.value})}/>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">PDF (URL opcional)</label>
            <Input className="rounded-2xl" placeholder="https://...pdf" value={form.pdf} onChange={e=>setForm({...form, pdf:e.target.value})}/>
          </div>
          <label className="flex items-center gap-2 text-sm mt-6 md:mt-0">
            <input type="checkbox" checked={form.ethics} onChange={e=>setForm({...form, ethics:e.target.checked})} className="scale-110"/>
            Declaro buenas prácticas, conflicto de interés y fuentes citadas.
          </label>
        </div>
        <div className="flex gap-3">
          <Button type="submit" className="rounded-2xl" disabled={loading}><Send className="w-4 h-4 mr-2"/>Enviar</Button>
          <Button type="button" variant="outline" className="rounded-2xl" onClick={()=>{
            const data = readSubmissions();
            const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "envios_ucimed_mi.json"; a.click(); URL.revokeObjectURL(url);
          }}>
            <FileText className="w-4 h-4 mr-2"/> Exportar envíos
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">✅ Base de datos conectada con Supabase. Los envíos se almacenan automáticamente y el equipo recibe notificaciones.</p>
      </form>
    </section>
  );
}

function Footer(){
  return (
    <footer className="border-t border-slate-200 mt-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-10 text-sm">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 grid place-items-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div className="font-bold text-lg bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
              Medicina Interna UCIMED
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Divulgación académica estudiantil. Este sitio no sustituye criterio clínico. 
            Para emergencias, contacta a los servicios locales.
          </p>
        </div>
        <div>
          <div className="font-bold text-slate-800 mb-4">Contacto</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors">
              <Mail className="w-4 h-4"/> 
              <a href="mailto:medicinainterna.ucimed@gmail.com" className="hover:underline">
                medicinainterna.ucimed@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors">
              <Instagram className="w-4 h-4"/> 
              <a href="https://instagram.com/medicina_interna_ucimed" className="hover:underline" target="_blank" rel="noreferrer">
                @medicina_interna_ucimed
              </a>
            </div>
          </div>
        </div>
        <div>
          <div className="font-bold text-slate-800 mb-4">Recursos</div>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              Guías KDIGO, AHA/ACC, EULAR
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              Plantilla para club de artículos
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              Política de autoría y revisión
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} UCIMED – Grupo de Interés en Medicina Interna. Desarrollado con ❤️ para estudiantes.
        </div>
      </div>
    </footer>
  );
}

export default function UCIMEDMedicinaInterna(){
  const [activeTab, setActiveTab] = useState("publicaciones");

  useEffect(()=>{
    // Inicializa almacenamiento si no existe
    if(!localStorage.getItem(STORAGE_KEY)) localStorage.setItem(STORAGE_KEY, "[]");
  },[]);

  const renderTabContent = () => {
    switch(activeTab) {
      case "publicaciones":
        return <Publicaciones/>;
      case "eventos":
        return <Eventos/>;
      case "equipo":
        return <Equipo/>;
      default:
        return <Publicaciones/>;
    }
  };

  return (
    <div className="min-h-screen">
      <Toaster richColors />
      <Navbar/>
      <Hero/>

      <div className="max-w-6xl mx-auto px-4 pt-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-1 shadow-lg">
            <TabsTrigger 
              value="publicaciones" 
              className="rounded-xl text-sm font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-700"
            >
              📚 Publicaciones
            </TabsTrigger>
            <TabsTrigger 
              value="eventos" 
              className="rounded-xl text-sm font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-700"
            >
              📅 Eventos
            </TabsTrigger>
            <TabsTrigger 
              value="equipo" 
              className="rounded-xl text-sm font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-700"
            >
              👥 Equipo
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-8">
            {renderTabContent()}
          </div>
        </Tabs>
      </div>

      <FormEnviar/>
      <Footer/>
    </div>
  );
}
