
import os
import webapp2
import jinja2
import urllib
import urllib2
import json

from google.appengine.ext import db

jinja_env = jinja2.Environment(autoescape=True,
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))

#Add Handlers for all HTML pages (ex: /schedule redirects to schedule.html)

#Guest class
class Guest(db.Model):
    first_name = db.StringProperty(required=True)
    last_name = db.StringProperty(required=True)
    email = db.EmailProperty(required=True)
    phone = db.StringProperty(required=True)
    free_class = db.StringProperty(required=True)

class Handler(webapp2.RequestHandler):
    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)

    def render_str(self, template, **params):
        t = jinja_env.get_template(template)
        return t.render(params)

    def render(self, template, **kw):
        self.write(self.render_str(template, **kw))

#Handler for a free class sign up
class GuestForm(Handler):
    def get(self): #Render sign up page
        email = self.request.get("email")

        if email:
            query = db.GqlQuery("select * from Guest where email=:1 limit 1", email)
            guest = query.get()

            self.render("form.html", firstname=guest.first_name, lastname=guest.last_name, email=guest.email, phone=guest.phone, free_class=guest.free_class, resubmit=True)
        else:
            self.render("form.html")

    def post(self): #Get submitted form data

        resubmit = self.request.get("resubmit")

        first_name = self.request.get("first_name")
        last_name = self.request.get("last_name")
        email = self.request.get("email")
        phone = self.request.get("phone")
        free_class = self.request.get("free_class")

        if resubmit == "True":
            query = db.GqlQuery("select * from Guest where email=:1 limit 1", email)
            guest = query.get()

            guest.free_class = free_class
            guest.put()

            self.render("thanks.html")
        else:
            #Create new Guest, render form again if info not filled out correctly
            if first_name and last_name and email and phone and free_class:
                user = Guest(first_name=first_name, last_name=last_name, email=email, phone=phone, free_class=free_class)
                user.put()

                self.render("thanks.html")
            else:
                error = "Please fill all required information!"
                self.render("form.html", firstname=first_name, lastname=last_name, email=email, phone=phone, free_class=free_class, error=error)

class MainPage(Handler):

    def get(self):
        self.render("index.html")

application = webapp2.WSGIApplication([('/', MainPage), ('/guestform', GuestForm)], debug=True)

