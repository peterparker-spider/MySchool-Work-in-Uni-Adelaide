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
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

public class Part2 extends Configured implements Tool {
   public static void main(String[] args) throws Exception {
      System.out.println(Arrays.toString(args));
      Configuration conf = new Configuration();
      conf.set("tragetLenght", args[2]);
      int res = ToolRunner.run(conf, new Part2(), args);
      
      System.exit(res);
   }

   @Override
   public int run(String[] args) throws Exception {
      System.out.println(Arrays.toString(args));
  	Job job = new Job(getConf(), "CountLength");
      job.setJarByClass(Part2.class);
      job.setOutputKeyClass(IntWritable.class);
      job.setOutputValueClass(IntWritable.class);

      job.setMapperClass(Map.class);
      job.setReducerClass(Reduce.class);

      //reads byte offset as key and whole line as value
      job.setInputFormatClass(TextInputFormat.class);
      //writes <k, v> pair per line
      job.setOutputFormatClass(TextOutputFormat.class);

      FileInputFormat.addInputPath(job, new Path(args[0]));
      FileOutputFormat.setOutputPath(job, new Path(args[1]));

      job.waitForCompletion(true);
      
      return 0;
   }
   
   public static class Map extends Mapper<LongWritable, Text, IntWritable, IntWritable> {
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

   public static class Reduce extends Reducer<IntWritable, IntWritable, IntWritable, IntWritable> {
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
}

