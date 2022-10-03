package edu.stanford.cs246.wordcount;

import java.io.IOException;
import java.lang.Integer;
import java.util.Arrays;
import java.util.StringTokenizer;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.Mapper.Context;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;
import org.apache.hadoop.fs.FileSystem;


public class Part3 extends Configured implements Tool {
	public static String path = "temp";
   public static void main(String[] args) throws Exception {
      System.out.println(Arrays.toString(args));
      Configuration conf = new Configuration();
      conf.set("tragetLenght", args[2]);
      int res = ToolRunner.run(conf, new Part3(), args);
      
      System.exit(res);
   }

   @Override
   public int run(String[] args) throws Exception {
      System.out.println(Arrays.toString(args));

  	  Job job = new Job(getConf(), "WrodCount");
      job.setJarByClass(Part3.class);
      job.setOutputKeyClass(Text.class);
      job.setOutputValueClass(IntWritable.class);

      job.setMapperClass(Map1.class);
      job.setReducerClass(Reduce1.class);

      //reads byte offset as key and whole line as value
      job.setInputFormatClass(TextInputFormat.class);
      //writes <k, v> pair per line
      job.setOutputFormatClass(TextOutputFormat.class);

      FileInputFormat.addInputPath(job, new Path(args[0]));
      FileOutputFormat.setOutputPath(job, new Path(Part3.path));

      job.waitForCompletion(true);
      
      // job 2
  	  job = new Job(getConf(), "CountFreq");
      job.setJarByClass(Part3.class);
      job.setOutputKeyClass(IntWritable.class);
      job.setOutputValueClass(IntWritable.class);

      job.setMapperClass(Map2.class);
      job.setReducerClass(Reduce2.class);

      //reads byte offset as key and whole line as value
      job.setInputFormatClass(TextInputFormat.class);
      //writes <k, v> pair per line
      job.setOutputFormatClass(TextOutputFormat.class);

      FileInputFormat.addInputPath(job, new Path(Part3.path));
      FileOutputFormat.setOutputPath(job, new Path(args[1]));

      job.waitForCompletion(true);
      

      return 0;
   }
   
   public static class Map2 extends Mapper<LongWritable, Text, IntWritable, IntWritable> {
      private final static IntWritable ONE = new IntWritable(1);
      private IntWritable wordLength = new IntWritable();

      @Override
      public void map(LongWritable key, Text value, Context context)
      			
          throws IOException, InterruptedException {
    	  StringTokenizer itr = new StringTokenizer(value.toString().toLowerCase());
    	  int v = Integer.parseInt(context.getConfiguration().get("tragetLenght") );
    	  
          while (itr.hasMoreTokens()) {
        	  wordLength.set(itr.nextToken().replaceAll("[^a-z]", "").length());
        	  if (v < 0 || v == wordLength.get()) {
        		  context.write(wordLength, ONE);
        	  }
          }
      }
   }

   public static class Reduce2 extends Reducer<IntWritable, IntWritable, IntWritable, IntWritable> {
      @Override
      public void reduce(IntWritable key, Iterable<IntWritable> values, Context context)
              throws IOException, InterruptedException {
         int sum = 0;
         for (IntWritable val : values) {
            sum += val.get();
         }
         context.write(key, new IntWritable(sum));
      }
   }
   
   public static class Map1 extends Mapper<LongWritable, Text, Text, IntWritable> {
	      private final static IntWritable ONE = new IntWritable(1);
	      private Text word = new Text();

	      @Override
	      public void map(LongWritable key, Text value, Context context)
	              throws IOException, InterruptedException {
	                  for (String token: value.toString().split("\\s+")) {
	                      word.set(token);
	                      context.write(word, ONE);
	                  }
	      }
	   }
   

	   public static class Reduce1 extends Reducer<Text, IntWritable, Text, IntWritable> {
	      @Override
	      public void reduce(Text key, Iterable<IntWritable> values, Context context)
	              throws IOException, InterruptedException {
	         int sum = 0;
	         for (IntWritable val : values) {
	            sum += val.get();
	         }
	         context.write(key, new IntWritable(sum));
	      }
	   }
	   
}

